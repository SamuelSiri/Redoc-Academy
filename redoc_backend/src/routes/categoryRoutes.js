const { Router } = require('express');
const categoryController = require('../controllers/categoryController');
const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');
const validate = require('../middlewares/validate');
const { createCategoryRules, createSubcategoryRules } = require('../validators/categoryValidator');
const { ROLES } = require('../utils/constants');

const router = Router();

router.use(auth); // Todas requieren autenticación

// Categorías
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', roleGuard(ROLES.TEACHER, ROLES.ADMIN), createCategoryRules, validate, categoryController.create);
router.put('/:id', roleGuard(ROLES.TEACHER, ROLES.ADMIN), createCategoryRules, validate, categoryController.update);
router.delete('/:id', roleGuard(ROLES.TEACHER, ROLES.ADMIN), categoryController.remove);

// Subcategorías
router.get('/:id/subcategories', categoryController.getSubcategories);
router.post('/:id/subcategories', roleGuard(ROLES.TEACHER, ROLES.ADMIN), createSubcategoryRules, validate, categoryController.createSubcategory);
router.put('/subcategories/:subId', roleGuard(ROLES.TEACHER, ROLES.ADMIN), createSubcategoryRules, validate, categoryController.updateSubcategory);
router.delete('/subcategories/:subId', roleGuard(ROLES.TEACHER, ROLES.ADMIN), categoryController.removeSubcategory);

module.exports = router;