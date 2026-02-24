const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const statsService = require('../services/statsService');
const adminService = require('../services/adminService');

const getStudentStats = asyncHandler(async (req, res) => {
  const stats = await statsService.getStudentStats(req.user.id);
  return success(res, { stats });
});

const getTeacherStats = asyncHandler(async (req, res) => {
  const stats = await statsService.getTeacherStats(req.user.id);
  return success(res, { stats });
});

const getAdminStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getAdminStats();
  return success(res, { stats });
});

module.exports = { getStudentStats, getTeacherStats, getAdminStats };
