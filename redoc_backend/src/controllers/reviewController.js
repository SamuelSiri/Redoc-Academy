const asyncHandler = require('../utils/asyncHandler');
const { success, error, paginated } = require('../utils/apiResponse');
const reviewService = require('../services/reviewService');

const create = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user.id, req.params.courseId, req.body);
  return success(res, { review }, 'Review creada', 201);
});

const remove = asyncHandler(async (req, res) => {
  const result = await reviewService.deleteReview(req.user.id, req.params.courseId);
  if (!result) return error(res, 'Review no encontrada', 404);
  return success(res, null, 'Review eliminada');
});

const getCourseReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getCourseReviews(req.params.courseId, req.query);
  return paginated(res, result.reviews, result.pagination, 'Reviews obtenidas');
});

module.exports = { create, remove, getCourseReviews };
