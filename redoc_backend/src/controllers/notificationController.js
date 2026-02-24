const asyncHandler = require('../utils/asyncHandler');
const { success, paginated } = require('../utils/apiResponse');
const notificationService = require('../services/notificationService');

const getAll = asyncHandler(async (req, res) => {
  const result = await notificationService.getNotifications(req.user.id, req.query);
  return paginated(res, result.notifications, result.pagination);
});

const markAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAsRead(req.params.id, req.user.id);
  return success(res, null, 'Notificación marcada como leída');
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);
  return success(res, null, 'Todas las notificaciones marcadas como leídas');
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user.id);
  return success(res, { count });
});

module.exports = { getAll, markAsRead, markAllAsRead, getUnreadCount };
