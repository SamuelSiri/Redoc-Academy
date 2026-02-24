const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack || err.message);

  // Errores de Prisma
  if (err.code === 'P2002') {
    const target = err.meta?.target;
    return res.status(409).json({
      success: false,
      message: `El registro ya existe${target ? ` (campo: ${target})` : ''}`,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Registro no encontrado',
    });
  }

  if (err.code === 'P2003') {
    return res.status(400).json({
      success: false,
      message: 'Referencia a registro inexistente',
    });
  }

  // Error genérico
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Error interno del servidor' : err.message;

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
