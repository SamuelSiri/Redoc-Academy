import api from './api';

export const statsService = {
  getStudentStats: () => api.get('/stats/student'),
  getTeacherStats: () => api.get('/stats/teacher'),
  getAdminStats: () => api.get('/stats/admin'),
};
