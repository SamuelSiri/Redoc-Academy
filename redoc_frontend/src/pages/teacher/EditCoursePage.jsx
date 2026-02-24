import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCourseStore from '../../store/courseStore';
import useCategoryStore from '../../store/categoryStore';
import { courseService } from '../../services/courseService';
import './EditCourse.css';

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentCourse, fetchCourseById, updateCourse, clearCurrent } = useCourseStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);
  const [newModule, setNewModule] = useState('');
  const [newLessons, setNewLessons] = useState({});

  useEffect(() => { fetchCategories(); fetchCourseById(id); return () => clearCurrent(); }, [id]);

  useEffect(() => {
    if (currentCourse) {
      setForm({
        title: currentCourse.title || '',
        description: currentCourse.description || '',
        shortDescription: currentCourse.shortDescription || '',
        categoryId: currentCourse.categoryId || '',
        subcategoryId: currentCourse.subcategoryId || '',
        difficulty: currentCourse.difficulty || 'BEGINNER',
        status: currentCourse.status || 'DRAFT',
        tags: currentCourse.tags?.join(', ') || '',
      });
    }
  }, [currentCourse]);

  if (!form) return <div className="edc"><p>Cargando...</p></div>;

  const selectedCat = categories.find((c) => c.id === Number(form.categoryId));
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCourse(id, { ...form, tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [] });
      toast.success('Curso actualizado');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar');
    }
    setSaving(false);
  };

  const handleAddModule = async () => {
    if (!newModule.trim()) return;
    try {
      await courseService.createModule(id, { title: newModule, order: (currentCourse.modules?.length || 0) + 1 });
      setNewModule('');
      toast.success('Módulo agregado');
      fetchCourseById(id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!confirm('¿Eliminar este módulo?')) return;
    try {
      await courseService.deleteModule(moduleId);
      toast.success('Módulo eliminado');
      fetchCourseById(id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleAddLesson = async (moduleId) => {
    const title = newLessons[moduleId];
    if (!title?.trim()) return;
    try {
      const mod = currentCourse.modules?.find((m) => m.id === moduleId);
      await courseService.createLesson(moduleId, { title, order: (mod?.lessons?.length || 0) + 1 });
      setNewLessons({ ...newLessons, [moduleId]: '' });
      toast.success('Lección agregada');
      fetchCourseById(id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('¿Eliminar esta lección?')) return;
    try {
      await courseService.deleteLesson(lessonId);
      toast.success('Lección eliminada');
      fetchCourseById(id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="edc">
      <div className="edc-head">
        <h1>Editar curso</h1>
        <button className="edc-btn" onClick={() => navigate('/teacher/courses')}>Volver</button>
      </div>

      <div className="edc-grid">
        <div className="edc-panel">
          <h2>Información del curso</h2>
          <div className="edc-field">
            <label>Título *</label>
            <input type="text" value={form.title} onChange={update('title')} required />
          </div>
          <div className="edc-field">
            <label>Descripción corta</label>
            <input type="text" value={form.shortDescription} onChange={update('shortDescription')} maxLength={500} />
          </div>
          <div className="edc-field">
            <label>Descripción completa</label>
            <textarea value={form.description} onChange={update('description')} rows={4} />
          </div>
          <div className="edc-row">
            <div className="edc-field">
              <label>Categoría</label>
              <select value={form.categoryId} onChange={update('categoryId')}>
                <option value="">Seleccionar...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="edc-field">
              <label>Subcategoría</label>
              <select value={form.subcategoryId} onChange={update('subcategoryId')}>
                <option value="">Seleccionar...</option>
                {selectedCat?.subcategories?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div className="edc-row">
            <div className="edc-field">
              <label>Dificultad</label>
              <select value={form.difficulty} onChange={update('difficulty')}>
                <option value="BEGINNER">Principiante</option>
                <option value="INTERMEDIATE">Intermedio</option>
                <option value="ADVANCED">Avanzado</option>
              </select>
            </div>
            <div className="edc-field">
              <label>Estado</label>
              <select value={form.status} onChange={update('status')}>
                <option value="DRAFT">Borrador</option>
                <option value="PUBLISHED">Publicado</option>
                <option value="ARCHIVED">Archivado</option>
              </select>
            </div>
          </div>
          <div className="edc-field">
            <label>Tags (separados por coma)</label>
            <input type="text" value={form.tags} onChange={update('tags')} />
          </div>
          <button className="edc-btn edc-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>

        <div className="edc-panel">
          <h2>Módulos y lecciones</h2>
          <div className="edc-modules">
            {currentCourse.modules?.sort((a, b) => a.order - b.order).map((mod) => (
              <div key={mod.id} className="edc-module">
                <div className="edc-module-head">
                  <strong>{mod.order}. {mod.title}</strong>
                  <button className="edc-icon-btn edc-icon-btn--danger" onClick={() => handleDeleteModule(mod.id)} title="Eliminar módulo">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
                <div className="edc-lessons">
                  {mod.lessons?.sort((a, b) => a.order - b.order).map((les) => (
                    <div key={les.id} className="edc-lesson">
                      <span>{les.order}. {les.title}</span>
                      <button className="edc-icon-btn edc-icon-btn--danger" onClick={() => handleDeleteLesson(les.id)} title="Eliminar lección">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  ))}
                  <div className="edc-add-row">
                    <input type="text" placeholder="Nueva lección..." value={newLessons[mod.id] || ''} onChange={(e) => setNewLessons({ ...newLessons, [mod.id]: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && handleAddLesson(mod.id)} />
                    <button className="edc-add-btn" onClick={() => handleAddLesson(mod.id)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="edc-add-row" style={{ marginTop: '1rem' }}>
            <input type="text" placeholder="Nuevo módulo..." value={newModule} onChange={(e) => setNewModule(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddModule()} />
            <button className="edc-add-btn" onClick={handleAddModule}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;
