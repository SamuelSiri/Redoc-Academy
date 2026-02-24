const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');
const categoryService = require('../services/categoryService');

// === CATEGORÍAS ===
const getAll = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  return success(res, { categories });
});

const getById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  if (!category) {
    return error(res, 'Categoría no encontrada', 404);
  }
  return success(res, { category });
});

const create = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  return success(res, { category }, 'Categoría creada', 201);
});

const update = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  if (!category) {
    return error(res, 'Categoría no encontrada', 404);
  }
  return success(res, { category }, 'Categoría actualizada');
});

const remove = asyncHandler(async (req, res) => {
  const result = await categoryService.deleteCategory(req.params.id);
  if (!result) {
    return error(res, 'Categoría no encontrada', 404);
  }
  return success(res, null, 'Categoría eliminada');
});

// === SUBCATEGORÍAS ===
const getSubcategories = asyncHandler(async (req, res) => {
  const subcategories = await categoryService.getSubcategoriesByCategory(req.params.id);
  return success(res, { subcategories });
});

const createSubcategory = asyncHandler(async (req, res) => {
  const subcategory = await categoryService.createSubcategory(req.params.id, req.body);
  if (!subcategory) {
    return error(res, 'Categoría padre no encontrada', 404);
  }
  return success(res, { subcategory }, 'Subcategoría creada', 201);
});

const updateSubcategory = asyncHandler(async (req, res) => {
  const subcategory = await categoryService.updateSubcategory(req.params.subId, req.body);
  if (!subcategory) {
    return error(res, 'Subcategoría no encontrada', 404);
  }
  return success(res, { subcategory }, 'Subcategoría actualizada');
});

const removeSubcategory = asyncHandler(async (req, res) => {
  const result = await categoryService.deleteSubcategory(req.params.subId);
  if (!result) {
    return error(res, 'Subcategoría no encontrada', 404);
  }
  return success(res, null, 'Subcategoría eliminada');
});

module.exports = {
  getAll, getById, create, update, remove,
  getSubcategories, createSubcategory, updateSubcategory, removeSubcategory,
};