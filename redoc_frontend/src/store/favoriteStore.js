import { create } from 'zustand';
import { favoriteService } from '../services/favoriteService';

const useFavoriteStore = create((set) => ({
  favorites: [],
  pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  loading: false,

  fetchFavorites: async (params) => {
    set({ loading: true });
    try {
      const { data } = await favoriteService.getMyFavorites(params);
      set({ favorites: data.data, pagination: data.pagination, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addFavorite: async (resourceId) => {
    const { data } = await favoriteService.add(resourceId);
    return data.data.favorite;
  },

  removeFavorite: async (resourceId) => {
    await favoriteService.remove(resourceId);
    set((state) => ({
      favorites: state.favorites.filter((f) => f.resourceId !== parseInt(resourceId)),
    }));
  },

  checkFavorite: async (resourceId) => {
    const { data } = await favoriteService.check(resourceId);
    return data.data.isFavorite;
  },
}));

export default useFavoriteStore;
