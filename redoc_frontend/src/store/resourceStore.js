import { create } from 'zustand';
import { resourceService } from '../services/resourceService';

const useResourceStore = create((set) => ({
  resources: [],
  currentResource: null,
  pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  loading: false,
  error: null,

  fetchResources: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { data } = await resourceService.getAll(params);
      set({
        resources: data.data,
        pagination: data.pagination,
        loading: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Error cargando recursos', loading: false });
    }
  },

  fetchResourceById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await resourceService.getById(id);
      set({ currentResource: data.data.resource, loading: false });
      return data.data.resource;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Error cargando recurso', loading: false });
    }
  },

  uploadResource: async (formData) => {
    const { data } = await resourceService.upload(formData);
    set((state) => ({
      resources: [data.data.resource, ...state.resources],
    }));
    return data.data.resource;
  },

  deleteResource: async (id) => {
    await resourceService.delete(id);
    set((state) => ({
      resources: state.resources.filter((r) => r.id !== id),
    }));
  },

  fetchMyUploads: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { data } = await resourceService.getMyUploads(params);
      set({
        resources: data.data,
        pagination: data.pagination,
        loading: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Error cargando recursos', loading: false });
    }
  },

  clearCurrent: () => set({ currentResource: null }),
}));

export default useResourceStore;