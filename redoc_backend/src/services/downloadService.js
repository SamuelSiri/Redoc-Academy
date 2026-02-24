const prisma = require('../config/prisma');

const recordDownload = async (userId, resourceId) => {
  return prisma.download.create({
    data: { userId, resourceId: parseInt(resourceId) },
  });
};

const getMyDownloads = async (userId, query = {}) => {
  const { page = 1, limit = 20 } = query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const where = { userId };

  const [downloads, total] = await Promise.all([
    prisma.download.findMany({
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
      orderBy: { downloadedAt: 'desc' },
      take: parseInt(limit),
      skip: offset,
      distinct: ['resourceId'],
    }),
    prisma.download.count({ where }),
  ]);

  return {
    downloads,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
  };
};

module.exports = { recordDownload, getMyDownloads };
