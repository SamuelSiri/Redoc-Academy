import useAuthStore from '../store/authStore';
import { ROLES } from '../utils/constants';

export const useAuth = () => {
  const { user, isAuthenticated, loading, login, register, logout, checkAuth } =
    useAuthStore();

  const isTeacher = user?.role === ROLES.TEACHER || user?.role === ROLES.ADMIN;
  const isStudent = user?.role === ROLES.STUDENT;
  const isAdmin = user?.role === ROLES.ADMIN;

  return {
    user,
    isAuthenticated,
    loading,
    isTeacher,
    isStudent,
    isAdmin,
    login,
    register,
    logout,
    checkAuth,
  };
};
