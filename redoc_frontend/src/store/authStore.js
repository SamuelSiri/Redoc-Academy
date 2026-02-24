import { create } from 'zustand';
import { authService } from '../services/authService';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('edu_user') || 'null'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: true,

  login: async ({ email, password }) => {
    const { data } = await authService.login({ email, password });
    const user = data.data.user;
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('edu_user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
    return user;
  },

  register: async ({ name, email, password, role }) => {
    const { data } = await authService.register({ name, email, password, role });
    const user = data.data.user;
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('edu_user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
    return user;
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch {
      // ignore logout errors
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('edu_user');
    set({ user: null, isAuthenticated: false });
  },

  setAuthFromGoogle: (userData, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('edu_user', JSON.stringify(userData));
    set({ user: userData, isAuthenticated: true, loading: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ loading: false, isAuthenticated: false });
      return;
    }
    try {
      const { data } = await authService.getMe();
      const user = data.data.user;
      localStorage.setItem('edu_user', JSON.stringify(user));
      set({ user, isAuthenticated: true, loading: false });
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('edu_user');
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },
}));

export default useAuthStore;
