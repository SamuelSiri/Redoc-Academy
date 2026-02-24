import { create } from 'zustand';
import { courseService } from '../services/courseService';

const useCourseStore = create((set) => ({
  courses: [],
  currentCourse: null,
  pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  loading: false,
  error: null,

  fetchCourses: async (params) => {
    set({ loading: true, error: null });
    try {
      const { data } = await courseService.getAll(params);
      set({ courses: data.data, pagination: data.pagination, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Error cargando cursos', loading: false });
    }
  },

  fetchCourseById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await courseService.getById(id);
      set({ currentCourse: data.data.course, loading: false });
      return data.data.course;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Error cargando curso', loading: false });
    }
  },

  fetchMyCourses: async (params) => {
    set({ loading: true, error: null });
    try {
      const { data } = await courseService.getMyCourses(params);
      set({ courses: data.data, pagination: data.pagination, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Error cargando cursos', loading: false });
    }
  },

  createCourse: async (courseData) => {
    const { data } = await courseService.create(courseData);
    return data.data.course;
  },

  updateCourse: async (id, courseData) => {
    const { data } = await courseService.update(id, courseData);
    set({ currentCourse: data.data.course });
    return data.data.course;
  },

  deleteCourse: async (id) => {
    await courseService.delete(id);
    set((state) => ({ courses: state.courses.filter((c) => c.id !== id) }));
  },

  clearCurrent: () => set({ currentCourse: null }),
}));

export default useCourseStore;
