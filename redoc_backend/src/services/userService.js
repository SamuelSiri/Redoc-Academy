const prisma = require('../config/prisma');

const findByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const findById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      bio: true,
      googleId: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const findByGoogleId = async (googleId) => {
  return prisma.user.findUnique({ where: { googleId } });
};

const createUser = async (data) => {
  return prisma.user.create({ data });
};

const updateUser = async (id, data) => {
  return prisma.user.update({ where: { id }, data });
};

const updateRefreshToken = async (id, refreshToken) => {
  return prisma.user.update({
    where: { id },
    data: { refreshToken },
  });
};

module.exports = {
  findByEmail,
  findById,
  findByGoogleId,
  createUser,
  updateUser,
  updateRefreshToken,
};
