import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCourseStore from '../../store/courseStore';
import './MyCourses.css';

const DIFFICULTY_LABELS = { BEGINNER: 'Principiante', INTERMEDIATE: 'Intermedio', ADVANCED: 'Avanzado' };
const STATUS_LABELS = { DRAFT: 'Borrador', PUBLISHED: 'Publicado', ARCHIVED: 'Archivado' };

const MyCoursesPage = () => {
  const { courses, loading, fetchMyCourses, deleteCourse } = useCourseStore();

  useEffect(() => { fetchMyCourses(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este curso?')) return;
    try {
      await deleteCourse(id);
      toast.success('Curso eliminado');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="myc">
      <div className="myc-head">
        <h1>Mis cursos</h1>
        <Link to="/teacher/courses/new" className="myc-btn myc-btn--primary">+ Crear curso</Link>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : courses.length === 0 ? (
        <div className="myc-empty">
          <p>No has creado ningún curso todavía.</p>
          <Link to="/teacher/courses/new" className="myc-btn myc-btn--primary">Crear mi primer curso</Link>
        </div>
      ) : (
        <div className="myc-list">
          {courses.map((course) => (
            <div key={course.id} className="myc-card">
              <div className="myc-card-body">
                <div className="myc-card-top">
                  <span className={`myc-status myc-status--${course.status?.toLowerCase()}`}>{STATUS_LABELS[course.status] || course.status}</span>
                  <span className="myc-diff">{DIFFICULTY_LABELS[course.difficulty] || course.difficulty}</span>
                </div>
                <h3>{course.title}</h3>
                <p>{course.shortDescription || 'Sin descripción corta'}</p>
                <div className="myc-meta">
                  <span>{course._count?.modules || 0} módulos</span>
                  <span>{course._count?.enrollments || 0} inscritos</span>
                </div>
              </div>
              <div className="myc-card-actions">
                <Link to={`/teacher/courses/${course.id}/edit`} className="myc-btn">Editar</Link>
                <button className="myc-btn myc-btn--danger" onClick={() => handleDelete(course.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
