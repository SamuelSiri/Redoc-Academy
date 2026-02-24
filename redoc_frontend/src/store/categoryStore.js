import { create } from 'zustand';
import { categoryService } from '../services/categoryService';

const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await categoryService.getAll();
      set({ categories: data.data.categories, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Error cargando categorías', loading: false });
    }
  },

  addCategory: async (categoryData) => {
    const { data } = await categoryService.create(categoryData);
    set((state) => ({
      categories: [...state.categories, { ...data.data.category, subcategories: [] }],
    }));
    return data.data.category;
  },

  updateCategory: async (id, categoryData) => {
    const { data } = await categoryService.update(id, categoryData);
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, ...data.data.category } : c
      ),
    }));
  },

  deleteCategory: async (id) => {
    await categoryService.delete(id);
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
  },

  addSubcategory: async (categoryId, subData) => {
    const { data } = await categoryService.createSubcategory(categoryId, subData);
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === categoryId
          ? { ...c, subcategories: [...(c.subcategories || []), data.data.subcategory] }
          : c
      ),
    }));
  },

  deleteSubcategory: async (categoryId, subId) => {
    await categoryService.deleteSubcategory(subId);
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === categoryId
          ? { ...c, subcategories: c.subcategories.filter((s) => s.id !== subId) }
          : c
      ),
    }));
  },
}));

export default useCategoryStore;