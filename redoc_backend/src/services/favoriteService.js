const prisma = require('../config/prisma');

const addFavorite = async (userId, resourceId) => {
  return prisma.favorite.create({
    data: { userId, resourceId: parseInt(resourceId) },
    include: {
      resource: {
        select: { id: true, title: true, fileType: true, thumbnailUrl: true },
      },
    },
  });
};

const removeFavorite = async (userId, resourceId) => {
  const fav = await prisma.favorite.findUnique({
    where: { userId_resourceId: { userId, resourceId: parseInt(resourceId) } },
  });
  if (!fav) return null;
  await prisma.favorite.delete({
    where: { userId_resourceId: { userId, resourceId: parseInt(resourceId) } },
  });
  return true;
};

const getMyFavorites = async (userId, query = {}) => {
  const { page = 1, limit = 20 } = query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const where = { userId };

  const [favorites, total] = await Promise.all([
    prisma.favorite.findMany({
      where,
      include: {
        resource: {
          include: {
            teacher: { select: { id: true, name: true } },
            subcategory: {
              select: {
                id: true, name: true,
                category: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: offset,
    }),
    prisma.favorite.count({ where }),
  ]);

  return {
    favorites,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
  };
};

const checkFavorite = async (userId, resourceId) => {
  const fav = await prisma.favorite.findUnique({
    where: { userId_resourceId: { userId, resourceId: parseInt(resourceId) } },
  });
  return !!fav;
};

module.exports = { addFavorite, removeFavorite, getMyFavorites, checkFavorite };
