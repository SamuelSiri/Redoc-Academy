import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCourseStore from '../../store/courseStore';
import useCategoryStore from '../../store/categoryStore';
import './CreateCourse.css';

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const { createCourse } = useCourseStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', shortDescription: '', categoryId: '', subcategoryId: '', difficulty: 'BEGINNER', tags: '',
  });

  useEffect(() => { fetchCategories(); }, []);

  const selectedCat = categories.find((c) => c.id === Number(form.categoryId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      const course = await createCourse(data);
      toast.success('Curso creado');
      navigate(`/teacher/courses/${course.id}/edit`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al crear curso');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="crc">
      <h1>Crear nuevo curso</h1>
      <form className="crc-form" onSubmit={handleSubmit}>
        <div className="crc-field">
          <label>Título del curso *</label>
          <input type="text" value={form.title} onChange={update('title')} required placeholder="Ej: JavaScript Moderno" />
        </div>
        <div className="crc-field">
          <label>Descripción corta</label>
          <input type="text" value={form.shortDescription} onChange={update('shortDescription')} placeholder="Una línea que describa el curso" maxLength={500} />
        </div>
        <div className="crc-field">
          <label>Descripción completa</label>
          <textarea value={form.description} onChange={update('description')} rows={5} placeholder="Descripción detallada del curso..." />
        </div>
        <div className="crc-row">
          <div className="crc-field">
            <label>Categoría *</label>
            <select value={form.categoryId} onChange={update('categoryId')} required>
              <option value="">Seleccionar...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="crc-field">
            <label>Subcategoría</label>
            <select value={form.subcategoryId} onChange={update('subcategoryId')}>
              <option value="">Seleccionar...</option>
              {selectedCat?.subcategories?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="crc-field">
            <label>Dificultad</label>
            <select value={form.difficulty} onChange={update('difficulty')}>
              <option value="BEGINNER">Principiante</option>
              <option value="INTERMEDIATE">Intermedio</option>
              <option value="ADVANCED">Avanzado</option>
            </select>
          </div>
        </div>
        <div className="crc-field">
          <label>Tags (separados por coma)</label>
          <input type="text" value={form.tags} onChange={update('tags')} placeholder="javascript, web, frontend" />
        </div>
        <div className="crc-actions">
          <button type="submit" className="crc-btn crc-btn--primary" disabled={loading}>
            {loading ? 'Creando...' : 'Crear curso'}
          </button>
          <button type="button" className="crc-btn" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoursePage;
