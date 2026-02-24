const prisma = require('../config/prisma');

const USER_SELECT = { id: true, name: true, email: true, avatarUrl: true };

const sendMessage = async (senderId, data) => {
  return prisma.message.create({
    data: {
      subject: data.subject,
      content: data.content,
      senderId,
      receiverId: parseInt(data.receiverId),
      parentId: data.parentId ? parseInt(data.parentId) : null,
    },
    include: {
      sender: { select: USER_SELECT },
      receiver: { select: USER_SELECT },
    },
  });
};

const getInbox = async (userId, query = {}) => {
  const { page = 1, limit = 20 } = query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const where = { receiverId: userId };

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      include: { sender: { select: USER_SELECT } },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: offset,
    }),
    prisma.message.count({ where }),
  ]);

  return {
    messages,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
  };
};

const getSent = async (userId, query = {}) => {
  const { page = 1, limit = 20 } = query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const where = { senderId: userId };

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      include: { receiver: { select: USER_SELECT } },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: offset,
    }),
    prisma.message.count({ where }),
  ]);

  return {
    messages,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
  };
};

const getMessageById = async (id, userId) => {
  const message = await prisma.message.findUnique({
    where: { id: parseInt(id) },
    include: {
      sender: { select: USER_SELECT },
      receiver: { select: USER_SELECT },
      replies: {
        include: { sender: { select: USER_SELECT } },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!message) return null;
  if (message.senderId !== userId && message.receiverId !== userId) return null;

  // Mark as read if receiver
  if (message.receiverId === userId && message.status === 'SENT') {
    await prisma.message.update({
      where: { id: parseInt(id) },
      data: { status: 'READ' },
    });
    message.status = 'READ';
  }

  return message;
};

const markAsRead = async (id, userId) => {
  const message = await prisma.message.findFirst({
    where: { id: parseInt(id), receiverId: userId },
  });
  if (!message) return null;
  return prisma.message.update({
    where: { id: parseInt(id) },
    data: { status: 'READ' },
  });
};

const deleteMessage = async (id, userId) => {
  const message = await prisma.message.findFirst({
    where: { id: parseInt(id), OR: [{ senderId: userId }, { receiverId: userId }] },
  });
  if (!message) return null;
  await prisma.message.delete({ where: { id: parseInt(id) } });
  return true;
};

module.exports = { sendMessage, getInbox, getSent, getMessageById, markAsRead, deleteMessage };
