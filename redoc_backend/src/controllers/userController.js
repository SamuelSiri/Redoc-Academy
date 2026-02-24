const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');
const userService = require('../services/userService');
const authService = require('../services/authService');

const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.findById(req.user.id);
  return success(res, { user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatarUrl, bio } = req.body;

  const user = await userService.updateUser(req.user.id, {
    ...(name && { name }),
    ...(avatarUrl && { avatarUrl }),
    ...(bio !== undefined && { bio }),
  });

  if (!user) {
    return error(res, 'Usuario no encontrado', 404);
  }

  return success(res, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      createdAt: user.createdAt,
    },
  }, 'Perfil actualizado');
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await userService.findByEmail(req.user.email);
  const isValid = await authService.comparePassword(currentPassword, user.password);

  if (!isValid) {
    return error(res, 'Contraseña actual incorrecta', 400);
  }

  const hashedPassword = await authService.hashPassword(newPassword);
  await userService.updateUser(req.user.id, { password: hashedPassword });

  return success(res, null, 'Contraseña actualizada');
});

module.exports = { getProfile, updateProfile, changePassword };