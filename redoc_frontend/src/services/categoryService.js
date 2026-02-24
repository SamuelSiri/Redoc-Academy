import api from './api';

export const categoryService = {
  getAll: () => api.get('/categories'),

  getById: (id) => api.get(`/categories/${id}`),

  create: (data) => api.post('/categories', data),

  update: (id, data) => api.put(`/categories/${id}`, data),

  delete: (id) => api.delete(`/categories/${id}`),

  // Subcategorías
  getSubcategories: (categoryId) =>
    api.get(`/categories/${categoryId}/subcategories`),

  createSubcategory: (categoryId, data) =>
    api.post(`/categories/${categoryId}/subcategories`, data),

  updateSubcategory: (subId, data) =>
    api.put(`/categories/subcategories/${subId}`, data),

  deleteSubcategory: (subId) =>
    api.delete(`/categories/subcategories/${subId}`),
};