const prisma = require('../config/prisma');

const createNotification = async (userId, data) => {
  return prisma.notification.create({
    data: {
      userId,
      title: data.title,
      message: data.message,
      type: data.type || 'info',
      link: data.link,
    },
  });
};

const getNotifications = async (userId, query = {}) => {
  const { page = 1, limit = 20 } = query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: offset,
    }),
    prisma.notification.count({ where: { userId } }),
  ]);

  return {
    notifications,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
  };
};

const markAsRead = async (id, userId) => {
  return prisma.notification.updateMany({
    where: { id: parseInt(id), userId },
    data: { read: true },
  });
};

const markAllAsRead = async (userId) => {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
};

const getUnreadCount = async (userId) => {
  return prisma.notification.count({
    where: { userId, read: false },
  });
};

module.exports = { createNotification, getNotifications, markAsRead, markAllAsRead, getUnreadCount };
