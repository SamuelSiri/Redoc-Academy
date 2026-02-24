import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useEnrollmentStore from '../../store/enrollmentStore';
import './StudentCourses.css';

const DIFFICULTY_LABELS = { BEGINNER: 'Principiante', INTERMEDIATE: 'Intermedio', ADVANCED: 'Avanzado' };

const MyCoursesPage = () => {
  const { enrollments, loading, fetchMyEnrollments } = useEnrollmentStore();
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { fetchMyEnrollments(); }, []);

  const filtered = filter === 'ALL' ? enrollments : enrollments.filter((e) => e.status === filter);

  return (
    <div className="stc">
      <div className="stc-head">
        <h1>Mis cursos</h1>
        <div className="stc-filters">
          {[['ALL', 'Todos'], ['ACTIVE', 'Activos'], ['COMPLETED', 'Completados']].map(([val, label]) => (
            <button key={val} className={`stc-filter ${filter === val ? 'stc-filter--active' : ''}`} onClick={() => setFilter(val)}>{label}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : filtered.length === 0 ? (
        <div className="stc-empty">
          <p>No tienes cursos {filter !== 'ALL' ? 'con este filtro' : 'inscritos todavía'}.</p>
          <Link to="/courses" className="stc-btn stc-btn--primary">Explorar cursos</Link>
        </div>
      ) : (
        <div className="stc-list">
          {filtered.map((enrollment) => {
            const course = enrollment.course || {};
            const progress = enrollment.progress || 0;
            return (
              <div key={enrollment.id} className="stc-card">
                <div className="stc-card-body">
                  <div className="stc-card-top">
                    <span className={`stc-status stc-status--${enrollment.status?.toLowerCase()}`}>
                      {enrollment.status === 'COMPLETED' ? 'Completado' : enrollment.status === 'ACTIVE' ? 'En progreso' : enrollment.status}
                    </span>
                    <span className="stc-diff">{DIFFICULTY_LABELS[course.difficulty] || course.difficulty}</span>
                  </div>
                  <h3>{course.title}</h3>
                  <p>{course.shortDescription || 'Sin descripción'}</p>
                  <div className="stc-progress">
                    <div className="stc-progress-bar">
                      <div className="stc-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="stc-progress-text">{Math.round(progress)}%</span>
                  </div>
                  {course.teacher && <span className="stc-teacher">Prof. {course.teacher.name}</span>}
                </div>
                <div className="stc-card-actions">
                  <Link to={`/courses/${course.id}/learn`} className="stc-btn stc-btn--primary">
                    {enrollment.status === 'COMPLETED' ? 'Repasar' : 'Continuar'}
                  </Link>
                  <Link to={`/courses/${course.id}`} className="stc-btn">Detalle</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
