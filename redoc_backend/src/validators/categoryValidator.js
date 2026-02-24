const { body } = require('express-validator');

const createCategoryRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('Entre 2 y 100 caracteres'),
  body('description')
    .optional()
    .trim(),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 50 }),
];

const createSubcategoryRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('Entre 2 y 100 caracteres'),
];

module.exports = { createCategoryRules, createSubcategoryRules };