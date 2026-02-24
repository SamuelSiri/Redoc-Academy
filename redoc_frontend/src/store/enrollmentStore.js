import { create } from 'zustand';
import { enrollmentService } from '../services/enrollmentService';

const useEnrollmentStore = create((set) => ({
  enrollments: [],
  currentEnrollment: null,
  pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  loading: false,
  error: null,

  fetchMyEnrollments: async (params) => {
    set({ loading: true, error: null });
    try {
      const { data } = await enrollmentService.getMyEnrollments(params);
      set({ enrollments: data.data, pagination: data.pagination, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Error', loading: false });
    }
  },

  getStatus: async (courseId) => {
    try {
      const { data } = await enrollmentService.getStatus(courseId);
      set({ currentEnrollment: data.data.enrollment });
      return data.data.enrollment;
    } catch {
      set({ currentEnrollment: null });
      return null;
    }
  },

  enroll: async (courseId) => {
    const { data } = await enrollmentService.enroll(courseId);
    return data.data.enrollment;
  },

  drop: async (courseId) => {
    await enrollmentService.drop(courseId);
    set((state) => ({
      enrollments: state.enrollments.filter((e) => e.courseId !== parseInt(courseId)),
      currentEnrollment: null,
    }));
  },

  completeLesson: async (lessonId) => {
    const { data } = await enrollmentService.completeLesson(lessonId);
    return data.data;
  },
}));

export default useEnrollmentStore;
