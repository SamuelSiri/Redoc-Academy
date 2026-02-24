const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');
const authService = require('../services/authService');
const userService = require('../services/userService');
const config = require('../config/env');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await userService.findByEmail(email);
  if (existing) {
    return error(res, 'El email ya está registrado', 409);
  }

  const hashedPassword = await authService.hashPassword(password);
  const user = await userService.createUser({
    name,
    email,
    password: hashedPassword,
    role: role || 'STUDENT',
  });

  const tokens = authService.generateTokens(user);
  await userService.updateRefreshToken(user.id, tokens.refreshToken);

  return success(res, {
    user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
    ...tokens,
  }, 'Registro exitoso', 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);
  if (!user) {
    return error(res, 'Credenciales inválidas', 401);
  }

  if (!user.password) {
    return error(res, 'Esta cuenta usa Google Sign-In. Inicia sesión con Google.', 401);
  }

  const isValid = await authService.comparePassword(password, user.password);
  if (!isValid) {
    return error(res, 'Credenciales inválidas', 401);
  }

  if (!user.isActive) {
    return error(res, 'Cuenta desactivada', 403);
  }

  const tokens = authService.generateTokens(user);
  await userService.updateRefreshToken(user.id, tokens.refreshToken);

  return success(res, {
    user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
    ...tokens,
  }, 'Login exitoso');
});

const logout = asyncHandler(async (req, res) => {
  await userService.updateRefreshToken(req.user.id, null);
  return success(res, null, 'Logout exitoso');
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return error(res, 'Refresh token requerido', 400);
  }

  try {
    const decoded = authService.verifyRefreshToken(token);
    const user = await userService.findById(decoded.id);

    if (!user) {
      return error(res, 'Usuario no encontrado', 401);
    }

    const tokens = authService.generateTokens(user);
    await userService.updateRefreshToken(user.id, tokens.refreshToken);

    return success(res, tokens, 'Token renovado');
  } catch (err) {
    return error(res, 'Refresh token inválido o expirado', 401);
  }
});

const me = asyncHandler(async (req, res) => {
  return success(res, { user: req.user });
});

const googleCallback = asyncHandler(async (req, res) => {
  const user = req.user;
  const tokens = authService.generateTokens(user);
  await userService.updateRefreshToken(user.id, tokens.refreshToken);

  const params = new URLSearchParams({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: JSON.stringify({
      id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl,
    }),
  });

  res.redirect(`${config.frontendUrl}/auth/google/callback?${params.toString()}`);
});

module.exports = { register, login, logout, refreshToken, me, googleCallback };
