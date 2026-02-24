const prisma = require('../config/prisma');

const COURSE_INCLUDE = {
  teacher: { select: { id: true, name: true, email: true, avatarUrl: true } },
  category: { select: { id: true, name: true, slug: true } },
  subcategory: { select: { id: true, name: true, slug: true } },
  modules: {
    orderBy: { order: 'asc' },
    include: {
      lessons: { orderBy: { order: 'asc' } },
    },
  },
  _count: { select: { enrollments: true, reviews: true } },
};

const COURSE_LIST_INCLUDE = {
  teacher: { select: { id: true, name: true, avatarUrl: true } },
  category: { select: { id: true, name: true, slug: true } },
  _count: { select: { enrollments: true, reviews: true } },
};

const getAllCourses = async (query = {}) => {
  const { page = 1, limit = 20, search, categoryId, difficulty, status = 'PUBLISHED' } = query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const where = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (categoryId) where.categoryId = parseInt(categoryId);
  if (difficulty) where.difficulty = difficulty;

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: COURSE_LIST_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: offset,
    }),
    prisma.course.count({ where }),
  ]);

  // Add avg rating
  const coursesWithRating = await Promise.all(
    courses.map(async (course) => {
      const avg = await prisma.review.aggregate({
        where: { courseId: course.id },
        _avg: { rating: true },
      });
      return { ...course, avgRating: avg._avg.rating || 0 };
    })
  );

  return {
    courses: coursesWithRating,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
  };
};

const getCourseById = async (id) => {
  const course = await prisma.course.findUnique({
    where: { id: parseInt(id) },
    include: COURSE_INCLUDE,
  });
  if (!course) return null;

  const avg = await prisma.review.aggregate({
    where: { courseId: course.id },
    _avg: { rating: true },
  });

  return { ...course, avgRating: avg._avg.rating || 0 };
};

const getTeacherCourses = async (teacherId, query = {}) => {
  const { page = 1, limit = 20 } = query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const where = { teacherId };

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: COURSE_LIST_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: offset,
    }),
    prisma.course.count({ where }),
  ]);

  return {
    courses,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
  };
};

const createCourse = async (data, teacherId) => {
  return prisma.course.create({
    data: {
      title: data.title,
      description: data.description,
      shortDescription: data.shortDescription,
      thumbnailUrl: data.thumbnailUrl,
      categoryId: parseInt(data.categoryId),
      subcategoryId: data.subcategoryId ? parseInt(data.subcategoryId) : null,
      difficulty: data.difficulty || 'BEGINNER',
      tags: data.tags || [],
      teacherId,
    },
    include: COURSE_INCLUDE,
  });
};

const updateCourse = async (id, data, teacherId) => {
  const course = await prisma.course.findFirst({
    where: { id: parseInt(id), teacherId },
  });
  if (!course) return null;

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
  if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl;
  if (data.categoryId !== undefined) updateData.categoryId = parseInt(data.categoryId);
  if (data.subcategoryId !== undefined) updateData.subcategoryId = data.subcategoryId ? parseInt(data.subcategoryId) : null;
  if (data.difficulty !== undefined) updateData.difficulty = data.difficulty;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.tags !== undefined) updateData.tags = data.tags;

  return prisma.course.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: COURSE_INCLUDE,
  });
};

const deleteCourse = async (id, teacherId) => {
  const course = await prisma.course.findFirst({
    where: { id: parseInt(id), teacherId },
  });
  if (!course) return null;
  await prisma.course.delete({ where: { id: parseInt(id) } });
  return true;
};

// Modules
const createModule = async (courseId, data, teacherId) => {
  const course = await prisma.course.findFirst({
    where: { id: parseInt(courseId), teacherId },
  });
  if (!course) return null;

  const maxOrder = await prisma.module.aggregate({
    where: { courseId: parseInt(courseId) },
    _max: { order: true },
  });

  return prisma.module.create({
    data: {
      title: data.title,
      description: data.description,
      order: (maxOrder._max.order || 0) + 1,
      courseId: parseInt(courseId),
    },
    include: { lessons: true },
  });
};

const updateModule = async (moduleId, data) => {
  return prisma.module.update({
    where: { id: parseInt(moduleId) },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.order !== undefined && { order: data.order }),
    },
  });
};

const deleteModule = async (moduleId) => {
  await prisma.module.delete({ where: { id: parseInt(moduleId) } });
  return true;
};

// Lessons
const createLesson = async (moduleId, data) => {
  const maxOrder = await prisma.lesson.aggregate({
    where: { moduleId: parseInt(moduleId) },
    _max: { order: true },
  });

  return prisma.lesson.create({
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      videoUrl: data.videoUrl,
      duration: data.duration || 0,
      order: (maxOrder._max.order || 0) + 1,
      isFree: data.isFree || false,
      moduleId: parseInt(moduleId),
    },
  });
};

const updateLesson = async (lessonId, data) => {
  return prisma.lesson.update({
    where: { id: parseInt(lessonId) },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.order !== undefined && { order: data.order }),
      ...(data.isFree !== undefined && { isFree: data.isFree }),
    },
  });
};

const deleteLesson = async (lessonId) => {
  await prisma.lesson.delete({ where: { id: parseInt(lessonId) } });
  return true;
};

module.exports = {
  getAllCourses, getCourseById, getTeacherCourses,
  createCourse, updateCourse, deleteCourse,
  createModule, updateModule, deleteModule,
  createLesson, updateLesson, deleteLesson,
};
