const prisma = require('../config/prisma');

const getAllUsers = async (query = {}) => {
  const { page = 1, limit = 20, search, role } = query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (role) where.role = role;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, role: true, avatarUrl: true,
        isActive: true, createdAt: true,
        _count: { select: { resources: true, enrollments: true, courses: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: offset,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
  };
};

const updateUser = async (id, data) => {
  return prisma.user.update({
    where: { id: parseInt(id) },
    data: {
      ...(data.role !== undefined && { role: data.role }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.name !== undefined && { name: data.name }),
    },
    select: {
      id: true, name: true, email: true, role: true, isActive: true, avatarUrl: true, createdAt: true,
    },
  });
};

const deleteUser = async (id) => {
  await prisma.user.delete({ where: { id: parseInt(id) } });
  return true;
};

const getAdminStats = async () => {
  const [totalUsers, totalCourses, totalResources, totalEnrollments,
    usersByRole, recentUsers, recentCourses] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.resource.count(),
    prisma.enrollment.count(),
    prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, name: true, email: true, role: true, createdAt: true } }),
    prisma.course.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { teacher: { select: { name: true } } } }),
  ]);

  return {
    totalUsers, totalCourses, totalResources, totalEnrollments,
    usersByRole: usersByRole.reduce((acc, r) => { acc[r.role] = r._count._all; return acc; }, {}),
    recentUsers, recentCourses,
  };
};

module.exports = { getAllUsers, updateUser, deleteUser, getAdminStats };
