import { useState } from 'react';
import useCategoryStore from '../../store/categoryStore';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const CategoryForm = () => {
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const { addCategory } = useCategoryStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setLoading(true);
    try {
      await addCategory(form);
      setForm({ name: '', description: '' });
      toast.success('Categoría creada');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creando categoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="category-form">
      <h3>Nueva Categoría</h3>
      <div className="form-row">
        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Descripción (opcional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Button type="submit" loading={loading}>
          Crear
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;