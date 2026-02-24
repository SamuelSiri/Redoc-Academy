import api from './api';

export const downloadService = {
  getMyDownloads: (params) => api.get('/downloads', { params }),
};
