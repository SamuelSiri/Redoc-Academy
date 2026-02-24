const asyncHandler = require('../utils/asyncHandler');
const { success, error, paginated } = require('../utils/apiResponse');
const messageService = require('../services/messageService');
const notificationService = require('../services/notificationService');

const send = asyncHandler(async (req, res) => {
  const message = await messageService.sendMessage(req.user.id, req.body);
  await notificationService.createNotification(parseInt(req.body.receiverId), {
    title: 'Nuevo mensaje',
    message: `${req.user.name} te envió un mensaje: "${req.body.subject}"`,
    type: 'message',
    link: `/messages/${message.id}`,
  });
  return success(res, { message }, 'Mensaje enviado', 201);
});

const getInbox = asyncHandler(async (req, res) => {
  const result = await messageService.getInbox(req.user.id, req.query);
  return paginated(res, result.messages, result.pagination);
});

const getSent = asyncHandler(async (req, res) => {
  const result = await messageService.getSent(req.user.id, req.query);
  return paginated(res, result.messages, result.pagination);
});

const getById = asyncHandler(async (req, res) => {
  const message = await messageService.getMessageById(req.params.id, req.user.id);
  if (!message) return error(res, 'Mensaje no encontrado', 404);
  return success(res, { message });
});

const reply = asyncHandler(async (req, res) => {
  const message = await messageService.sendMessage(req.user.id, {
    ...req.body,
    parentId: req.params.id,
  });
  return success(res, { message }, 'Respuesta enviada', 201);
});

const remove = asyncHandler(async (req, res) => {
  const result = await messageService.deleteMessage(req.params.id, req.user.id);
  if (!result) return error(res, 'Mensaje no encontrado', 404);
  return success(res, null, 'Mensaje eliminado');
});

const markAsRead = asyncHandler(async (req, res) => {
  const result = await messageService.markAsRead(req.params.id, req.user.id);
  if (!result) return error(res, 'Mensaje no encontrado', 404);
  return success(res, null, 'Mensaje marcado como leído');
});

module.exports = { send, getInbox, getSent, getById, reply, remove, markAsRead };
