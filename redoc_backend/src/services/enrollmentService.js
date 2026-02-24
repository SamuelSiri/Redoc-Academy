const prisma = require('../config/prisma');

const enroll = async (userId, courseId) => {
  return prisma.enrollment.create({
    data: { userId, courseId: parseInt(courseId) },
    include: {
      course: { select: { id: true, title: true, thumbnailUrl: true } },
    },
  });
};

const drop = async (userId, courseId) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: parseInt(courseId) } },
  });
  if (!enrollment) return null;
  await prisma.enrollment.delete({
    where: { userId_courseId: { userId, courseId: parseInt(courseId) } },
  });
  return true;
};

const getMyEnrollments = async (userId, query = {}) => {
  const { page = 1, limit = 20, status } = query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const where = { userId };
  if (status) where.status = status;

  const [enrollments, total] = await Promise.all([
    prisma.enrollment.findMany({
      where,
      include: {
        course: {
          include: {
            teacher: { select: { id: true, name: true, avatarUrl: true } },
            category: { select: { id: true, name: true } },
            _count: { select: { modules: true } },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
      take: parseInt(limit),
      skip: offset,
    }),
    prisma.enrollment.count({ where }),
  ]);

  return {
    enrollments,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
  };
};

const getEnrollmentStatus = async (userId, courseId) => {
  return prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: parseInt(courseId) } },
    include: {
      course: {
        include: {
          modules: {
            include: { lessons: { select: { id: true } } },
          },
        },
      },
    },
  });
};

const completeLesson = async (userId, lessonId) => {
  // Upsert lesson progress
  const progress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId: parseInt(lessonId) } },
    update: { completed: true, completedAt: new Date() },
    create: { userId, lessonId: parseInt(lessonId), completed: true, completedAt: new Date() },
  });

  // Recalculate course progress
  const lesson = await prisma.lesson.findUnique({
    where: { id: parseInt(lessonId) },
    include: { module: { select: { courseId: true } } },
  });

  if (lesson) {
    const courseId = lesson.module.courseId;

    // Get total lessons in course
    const totalLessons = await prisma.lesson.count({
      where: { module: { courseId } },
    });

    // Get completed lessons by user
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId,
        completed: true,
        lesson: { module: { courseId } },
      },
    });

    const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    const enrollmentData = {
      progress: progressPercent,
    };

    if (progressPercent >= 100) {
      enrollmentData.status = 'COMPLETED';
      enrollmentData.completedAt = new Date();
    }

    await prisma.enrollment.updateMany({
      where: { userId, courseId },
      data: enrollmentData,
    });

    return { progress: progressPercent, completed: progressPercent >= 100 };
  }

  return progress;
};

module.exports = { enroll, drop, getMyEnrollments, getEnrollmentStatus, completeLesson };
