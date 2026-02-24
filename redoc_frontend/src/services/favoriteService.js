import api from './api';

export const favoriteService = {
  getMyFavorites: (params) => api.get('/favorites', { params }),
  add: (resourceId) => api.post(`/favorites/${resourceId}`),
  remove: (resourceId) => api.delete(`/favorites/${resourceId}`),
  check: (resourceId) => api.get(`/favorites/check/${resourceId}`),
};
