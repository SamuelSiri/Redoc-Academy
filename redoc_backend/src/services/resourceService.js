const prisma = require('../config/prisma');
const { MIME_TO_FILE_TYPE, FILE_TYPES } = require('../utils/constants');

const RESOURCE_INCLUDE = {
  teacher: { select: { id: true, name: true, email: true } },
  subcategory: {
    select: {
      id: true, name: true, slug: true,
      category: { select: { id: true, name: true, slug: true } },
    },
  },
};

const createResource = async (data, file, teacherId) => {
  const fileType = MIME_TO_FILE_TYPE[file.mimetype] || FILE_TYPES.OTHER;

  return prisma.resource.create({
    data: {
      title: data.title,
      description: data.description || null,
      fileUrl: data.fileUrl,
      fileType,
      fileSize: file.size,
      mimeType: file.mimetype,
      originalName: file.originalname,
      teacherId,
      subcategoryId: parseInt(data.subcategoryId),
    },
  });
};

const getAllResources = async (query = {}) => {
  const { page = 1, limit = 20, search, fileType, subcategoryId, categoryId } = query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const where = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (fileType) {
    where.fileType = fileType.toUpperCase();
  }

  if (subcategoryId) {
    where.subcategoryId = parseInt(subcategoryId);
  }

  if (categoryId) {
    where.subcategory = { categoryId: parseInt(categoryId) };
  }

  const [resources, total] = await Promise.all([
    prisma.resource.findMany({
      where,
      include: RESOURCE_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: offset,
    }),
    prisma.resource.count({ where }),
  ]);

  return {
    resources,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const getResourceById = async (id) => {
  return prisma.resource.findUnique({
    where: { id: parseInt(id) },
    include: RESOURCE_INCLUDE,
  });
};

const getResourcesByTeacher = async (teacherId, query = {}) => {
  const { page = 1, limit = 20 } = query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const where = { teacherId };

  const [resources, total] = await Promise.all([
    prisma.resource.findMany({
      where,
      include: RESOURCE_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: offset,
    }),
    prisma.resource.count({ where }),
  ]);

  return {
    resources,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const updateResource = async (id, data, teacherId) => {
  const resource = await prisma.resource.findFirst({
    where: { id: parseInt(id), teacherId },
  });
  if (!resource) return null;

  if (data.subcategoryId) data.subcategoryId = parseInt(data.subcategoryId);
  return prisma.resource.update({ where: { id: parseInt(id) }, data });
};

const deleteResource = async (id, teacherId) => {
  const resource = await prisma.resource.findFirst({
    where: { id: parseInt(id), teacherId },
  });
  if (!resource) return null;

  await prisma.resource.delete({ where: { id: parseInt(id) } });
  return resource.fileUrl;
};

const incrementDownload = async (id) => {
  return prisma.resource.update({
    where: { id: parseInt(id) },
    data: { downloadCount: { increment: 1 } },
  });
};

module.exports = {
  createResource,
  getAllResources,
  getResourceById,
  getResourcesByTeacher,
  updateResource,
  deleteResource,
  incrementDownload,
};
