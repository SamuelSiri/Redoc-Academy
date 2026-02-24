const slugify = require('slugify');
const prisma = require('../config/prisma');

const getAllCategories = async () => {
  return prisma.category.findMany({
    include: {
      subcategories: {
        select: { id: true, name: true, slug: true },
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  });
};

const getCategoryById = async (id) => {
  return prisma.category.findUnique({
    where: { id },
    include: { subcategories: true },
  });
};

const createCategory = async (data) => {
  const slug = slugify(data.name, { lower: true, strict: true });
  return prisma.category.create({ data: { ...data, slug } });
};

const updateCategory = async (id, data) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return null;

  if (data.name) {
    data.slug = slugify(data.name, { lower: true, strict: true });
  }
  return prisma.category.update({ where: { id }, data });
};

const deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return null;
  await prisma.category.delete({ where: { id } });
  return true;
};

const getSubcategoriesByCategory = async (categoryId) => {
  return prisma.subcategory.findMany({
    where: { categoryId },
    orderBy: { name: 'asc' },
  });
};

const createSubcategory = async (categoryId, data) => {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) return null;

  const slug = slugify(data.name, { lower: true, strict: true });
  return prisma.subcategory.create({
    data: { ...data, slug, categoryId },
  });
};

const updateSubcategory = async (id, data) => {
  const sub = await prisma.subcategory.findUnique({ where: { id } });
  if (!sub) return null;

  if (data.name) {
    data.slug = slugify(data.name, { lower: true, strict: true });
  }
  return prisma.subcategory.update({ where: { id }, data });
};

const deleteSubcategory = async (id) => {
  const sub = await prisma.subcategory.findUnique({ where: { id } });
  if (!sub) return null;
  await prisma.subcategory.delete({ where: { id } });
  return true;
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategoriesByCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
