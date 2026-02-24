import api from './api';

export const messageService = {
  send: (data) => api.post('/messages', data),
  getInbox: (params) => api.get('/messages/inbox', { params }),
  getSent: (params) => api.get('/messages/sent', { params }),
  getById: (id) => api.get(`/messages/${id}`),
  reply: (id, data) => api.post(`/messages/${id}/reply`, data),
  delete: (id) => api.delete(`/messages/${id}`),
  markAsRead: (id) => api.patch(`/messages/${id}/read`),
};
