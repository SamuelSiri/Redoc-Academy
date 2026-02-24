const { error } = require('../utils/apiResponse');

const roleGuard = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'No autenticado', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return error(res, 'No tienes permisos para esta acción', 403);
    }

    next();
  };
};

module.exports = roleGuard;