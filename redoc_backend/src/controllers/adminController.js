const asyncHandler = require('../utils/asyncHandler');
const { success, error, paginated } = require('../utils/apiResponse');
const adminService = require('../services/adminService');

const getUsers = asyncHandler(async (req, res) => {
  const result = await adminService.getAllUsers(req.query);
  return paginated(res, result.users, result.pagination);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await adminService.updateUser(req.params.id, req.body);
  return success(res, { user }, 'Usuario actualizado');
});

const deleteUser = asyncHandler(async (req, res) => {
  await adminService.deleteUser(req.params.id);
  return success(res, null, 'Usuario eliminado');
});

const getStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getAdminStats();
  return success(res, { stats });
});

module.exports = { getUsers, updateUser, deleteUser, getStats };
