const prisma = require('../config/prisma');

const getStudentStats = async (userId) => {
  const [enrollments, completedCourses, certificates, favorites, downloads, totalResources] = await Promise.all([
    prisma.enrollment.count({ where: { userId } }),
    prisma.enrollment.count({ where: { userId, status: 'COMPLETED' } }),
    prisma.certificate.count({ where: { userId } }),
    prisma.favorite.count({ where: { userId } }),
    prisma.download.count({ where: { userId } }),
    prisma.resource.count(),
  ]);

  const recentEnrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: { course: { select: { id: true, title: true, thumbnailUrl: true } } },
    orderBy: { enrolledAt: 'desc' },
    take: 5,
  });

  return {
    enrollments, completedCourses, certificates, favorites, downloads,
    totalResources, recentEnrollments,
  };
};

const getTeacherStats = async (userId) => {
  const [totalCourses, totalResources, totalStudents, totalDownloads, totalReviews] = await Promise.all([
    prisma.course.count({ where: { teacherId: userId } }),
    prisma.resource.count({ where: { teacherId: userId } }),
    prisma.enrollment.count({ where: { course: { teacherId: userId } } }),
    prisma.resource.aggregate({ where: { teacherId: userId }, _sum: { downloadCount: true } }),
    prisma.review.count({ where: { course: { teacherId: userId } } }),
  ]);

  const avgRating = await prisma.review.aggregate({
    where: { course: { teacherId: userId } },
    _avg: { rating: true },
  });

  const recentCourses = await prisma.course.findMany({
    where: { teacherId: userId },
    include: { _count: { select: { enrollments: true } } },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const topResources = await prisma.resource.findMany({
    where: { teacherId: userId },
    orderBy: { downloadCount: 'desc' },
    take: 5,
    select: { id: true, title: true, downloadCount: true, fileType: true },
  });

  return {
    totalCourses, totalResources,
    totalStudents,
    totalDownloads: totalDownloads._sum.downloadCount || 0,
    totalReviews,
    avgRating: avgRating._avg.rating || 0,
    recentCourses, topResources,
  };
};

module.exports = { getStudentStats, getTeacherStats };
