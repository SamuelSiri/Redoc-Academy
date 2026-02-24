import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useCourseStore from '../store/courseStore';
import useCategoryStore from '../store/categoryStore';
import { DIFFICULTY_LABELS } from '../utils/constants';
import './CourseCatalogPage.css';

const CourseCatalogPage = () => {
  const { courses, pagination, loading, fetchCourses } = useCourseStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => { fetchCategories(); }, []);

  useEffect(() => {
    const params = { page: 1, limit: 20 };
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId;
    if (difficulty) params.difficulty = difficulty;
    fetchCourses(params);
  }, [search, categoryId, difficulty]);

  return (
    <div className="cc">
      <div className="cc-head">
        <h1>Cursos</h1>
        <p>{pagination?.total || 0} cursos disponibles</p>
      </div>

      <div className="cc-filters">
        <div className="cc-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Buscar cursos..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">Todos los niveles</option>
          <option value="BEGINNER">Principiante</option>
          <option value="INTERMEDIATE">Intermedio</option>
          <option value="ADVANCED">Avanzado</option>
        </select>
      </div>

      {loading ? (
        <div className="cc-loading">Cargando cursos...</div>
      ) : courses.length === 0 ? (
        <div className="cc-empty">
          <p>No se encontraron cursos</p>
        </div>
      ) : (
        <div className="cc-grid">
          {courses.map((course) => (
            <Link to={`/courses/${course.id}`} key={course.id} className="cc-card">
              <div className="cc-card-img">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} />
                ) : (
                  <div className="cc-card-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  </div>
                )}
                <span className="cc-card-diff" data-diff={course.difficulty}>
                  {DIFFICULTY_LABELS[course.difficulty] || course.difficulty}
                </span>
              </div>
              <div className="cc-card-body">
                <span className="cc-card-cat">{course.category?.name}</span>
                <h3>{course.title}</h3>
                <p>{course.shortDescription || course.description?.substring(0, 100)}</p>
                <div className="cc-card-footer">
                  <div className="cc-card-teacher">
                    <div className="cc-card-avatar">{course.teacher?.name?.charAt(0)}</div>
                    <span>{course.teacher?.name}</span>
                  </div>
                  <div className="cc-card-stats">
                    <span>{course._count?.enrollments || 0} estudiantes</span>
                    {course.avgRating > 0 && <span>★ {course.avgRating.toFixed(1)}</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseCatalogPage;
