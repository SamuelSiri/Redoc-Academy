const asyncHandler = require('../utils/asyncHandler');
const { success, error, paginated } = require('../utils/apiResponse');
const courseService = require('../services/courseService');

const getAll = asyncHandler(async (req, res) => {
  const result = await courseService.getAllCourses(req.query);
  return paginated(res, result.courses, result.pagination);
});

const getById = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseById(req.params.id);
  if (!course) return error(res, 'Curso no encontrado', 404);
  return success(res, { course });
});

const getMyCourses = asyncHandler(async (req, res) => {
  const result = await courseService.getTeacherCourses(req.user.id, req.query);
  return paginated(res, result.courses, result.pagination);
});

const create = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.body, req.user.id);
  return success(res, { course }, 'Curso creado', 201);
});

const update = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.body, req.user.id);
  if (!course) return error(res, 'Curso no encontrado o sin permisos', 404);
  return success(res, { course }, 'Curso actualizado');
});

const remove = asyncHandler(async (req, res) => {
  const result = await courseService.deleteCourse(req.params.id, req.user.id);
  if (!result) return error(res, 'Curso no encontrado o sin permisos', 404);
  return success(res, null, 'Curso eliminado');
});

// Modules
const createModule = asyncHandler(async (req, res) => {
  const mod = await courseService.createModule(req.params.id, req.body, req.user.id);
  if (!mod) return error(res, 'Curso no encontrado o sin permisos', 404);
  return success(res, { module: mod }, 'Módulo creado', 201);
});

const updateModule = asyncHandler(async (req, res) => {
  const mod = await courseService.updateModule(req.params.id, req.body);
  return success(res, { module: mod }, 'Módulo actualizado');
});

const deleteModule = asyncHandler(async (req, res) => {
  await courseService.deleteModule(req.params.id);
  return success(res, null, 'Módulo eliminado');
});

// Lessons
const createLesson = asyncHandler(async (req, res) => {
  const lesson = await courseService.createLesson(req.params.id, req.body);
  return success(res, { lesson }, 'Lección creada', 201);
});

const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await courseService.updateLesson(req.params.id, req.body);
  return success(res, { lesson }, 'Lección actualizada');
});

const deleteLesson = asyncHandler(async (req, res) => {
  await courseService.deleteLesson(req.params.id);
  return success(res, null, 'Lección eliminada');
});

module.exports = {
  getAll, getById, getMyCourses, create, update, remove,
  createModule, updateModule, deleteModule,
  createLesson, updateLesson, deleteLesson,
};
