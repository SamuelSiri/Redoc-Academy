const prisma = require('../config/prisma');

const createReview = async (userId, courseId, data) => {
  return prisma.review.create({
    data: {
      rating: parseInt(data.rating),
      comment: data.comment,
      userId,
      courseId: parseInt(courseId),
    },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
    },
  });
};

const deleteReview = async (userId, courseId) => {
  const review = await prisma.review.findUnique({
    where: { userId_courseId: { userId, courseId: parseInt(courseId) } },
  });
  if (!review) return null;
  await prisma.review.delete({
    where: { userId_courseId: { userId, courseId: parseInt(courseId) } },
  });
  return true;
};

const getCourseReviews = async (courseId, query = {}) => {
  const { page = 1, limit = 20 } = query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const where = { courseId: parseInt(courseId) };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: offset,
    }),
    prisma.review.count({ where }),
  ]);

  const avg = await prisma.review.aggregate({
    where,
    _avg: { rating: true },
  });

  return {
    reviews,
    avgRating: avg._avg.rating || 0,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
  };
};

module.exports = { createReview, deleteReview, getCourseReviews };
