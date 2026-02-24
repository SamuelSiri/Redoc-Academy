import api from './api';

export const enrollmentService = {
  getMyEnrollments: (params) => api.get('/enrollments', { params }),
  getStatus: (courseId) => api.get(`/enrollments/${courseId}`),
  enroll: (courseId) => api.post(`/enrollments/${courseId}`),
  drop: (courseId) => api.delete(`/enrollments/${courseId}`),
  completeLesson: (lessonId) => api.post(`/enrollments/lessons/${lessonId}/complete`),
};
