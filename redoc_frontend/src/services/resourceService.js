import api from './api';
import { API_URL } from '../utils/constants';

export const resourceService = {
  getAll: (params = {}) => api.get('/resources', { params }),

  getById: (id) => api.get(`/resources/${id}`),

  upload: (formData) =>
    api.post('/resources', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id, data) => api.put(`/resources/${id}`, data),

  delete: (id) => api.delete(`/resources/${id}`),

  getMyUploads: (params = {}) => api.get('/resources/my-uploads', { params }),

  getDownloadUrl: (id) => `${API_URL}/resources/${id}/download`,
};