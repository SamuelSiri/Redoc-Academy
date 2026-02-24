const asyncHandler = require('../utils/asyncHandler');
const { success, error, paginated } = require('../utils/apiResponse');
const enrollmentService = require('../services/enrollmentService');
const notificationService = require('../services/notificationService');

const enroll = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.enroll(req.user.id, req.params.courseId);
  await notificationService.createNotification(req.user.id, {
    title: 'Inscripción exitosa',
    message: `Te has inscrito en "${enrollment.course.title}"`,
    type: 'enrollment',
    link: `/courses/${req.params.courseId}`,
  });
  return success(res, { enrollment }, 'Inscripción exitosa', 201);
});

const drop = asyncHandler(async (req, res) => {
  const result = await enrollmentService.drop(req.user.id, req.params.courseId);
  if (!result) return error(res, 'No estás inscrito en este curso', 404);
  return success(res, null, 'Inscripción cancelada');
});

const getMyEnrollments = asyncHandler(async (req, res) => {
  const result = await enrollmentService.getMyEnrollments(req.user.id, req.query);
  return paginated(res, result.enrollments, result.pagination);
});

const getStatus = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.getEnrollmentStatus(req.user.id, req.params.courseId);
  if (!enrollment) return error(res, 'No estás inscrito en este curso', 404);
  return success(res, { enrollment });
});

const completeLesson = asyncHandler(async (req, res) => {
  const result = await enrollmentService.completeLesson(req.user.id, req.params.lessonId);
  return success(res, result, 'Lección completada');
});

module.exports = { enroll, drop, getMyEnrollments, getStatus, completeLesson };
