import api from './api';

export const certificateService = {
  generate: (courseId) => api.post(`/certificates/${courseId}`),
  getMyCertificates: () => api.get('/certificates'),
  verify: (code) => api.get(`/certificates/verify/${code}`),
};
