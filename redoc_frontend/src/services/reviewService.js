import api from './api';

export const reviewService = {
  getCourseReviews: (courseId, params) => api.get(`/reviews/course/${courseId}`, { params }),
  create: (courseId, data) => api.post(`/reviews/${courseId}`, data),
  delete: (courseId) => api.delete(`/reviews/${courseId}`),
};
