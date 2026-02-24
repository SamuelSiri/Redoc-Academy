const { body } = require('express-validator');

const uploadResourceRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('El título es requerido')
    .isLength({ min: 2, max: 255 }).withMessage('Entre 2 y 255 caracteres'),
  body('description')
    .optional()
    .trim(),
  body('subcategoryId')
    .notEmpty().withMessage('La subcategoría es requerida')
    .isInt().withMessage('ID de subcategoría inválido'),
];

const updateResourceRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 }),
  body('description')
    .optional()
    .trim(),
  body('subcategoryId')
    .optional()
    .isInt().withMessage('ID de subcategoría inválido'),
];

module.exports = { uploadResourceRules, updateResourceRules };