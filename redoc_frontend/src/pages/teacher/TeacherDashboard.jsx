import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { statsService } from '../../services/statsService';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await statsService.getTeacherStats();
        setStats(data.data?.stats || data.stats);
      } catch (err) {
        console.error('Error fetching teacher stats:', err);
        setError('No se pudieron cargar las estadísticas.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="td">
        <div className="td-head">
          <div>
            <h1>Cargando...</h1>
            <p>Obteniendo tus estadísticas</p>
          </div>
        </div>
        <div className="td-stats">
          {[1, 2, 3, 4].map((i) => (
            <div className="td-card td-card--purple" key={i} style={{ opacity: 0.5 }}>
              <div className="td-card-icon" />
              <span className="td-card-val">--</span>
              <span className="td-card-label">Cargando...</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="td">
        <div className="td-head">
          <div>
            <h1>Error</h1>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const {
    totalCourses = 0,
    totalResources = 0,
    totalStudents = 0,
    totalDownloads = 0,
    totalReviews = 0,
    avgRating = 0,
    recentCourses = [],
    topResources = [],
  } = stats || {};

  return (
    <div className="td">
      {/* Header */}
      <div className="td-head">
        <div>
          <h1>Bienvenido, {user?.name?.split(' ').pop()}</h1>
          <p>Aquí tienes un resumen de tu actividad</p>
        </div>
        <Link to="/teacher/upload" className="td-head-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Subir recurso
        </Link>
      </div>

      {/* Stat cards */}
      <div className="td-stats">
        <div className="td-card td-card--purple">
          <div className="td-card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <span className="td-card-val">{totalCourses}</span>
          <span className="td-card-label">Cursos totales</span>
        </div>

        <div className="td-card td-card--blue">
          <div className="td-card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <span className="td-card-val">{totalStudents}</span>
          <span className="td-card-label">Estudiantes activos</span>
        </div>

        <div className="td-card td-card--emerald">
          <div className="td-card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </div>
          <span className="td-card-val">{totalDownloads.toLocaleString()}</span>
          <span className="td-card-label">Descargas totales</span>
        </div>

        <div className="td-card td-card--amber">
          <div className="td-card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <span className="td-card-val">{Number(avgRating).toFixed(1)}</span>
          <span className="td-card-label">Calificación promedio</span>
        </div>
      </div>

      {/* Middle row: Recent Courses + Top Resources summary */}
      <div className="td-mid">
        {/* Recent Courses */}
        <div className="td-panel td-chart-panel">
          <h3>Cursos recientes</h3>
          <div className="td-cats">
            {recentCourses.length > 0 ? (
              recentCourses.map((course) => (
                <div className="td-cat" key={course.id}>
                  <div className="td-cat-head">
                    <span className="td-cat-name">{course.title}</span>
                    <span className="td-cat-count">{course.studentCount ?? 0} estudiantes</span>
                  </div>
                  <div className="td-cat-track">
                    <div
                      className="td-cat-fill"
                      style={{
                        width: `${Math.min(
                          ((course.studentCount ?? 0) /
                            Math.max(
                              ...recentCourses.map((c) => c.studentCount ?? 0),
                              1
                            )) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#9ca3af', fontSize: 14 }}>No hay cursos recientes.</p>
            )}
          </div>
        </div>

        {/* Stats summary panel */}
        <div className="td-panel td-cat-panel">
          <h3>Resumen general</h3>
          <div className="td-cats">
            <div className="td-cat">
              <div className="td-cat-head">
                <span className="td-cat-name">Recursos subidos</span>
                <span className="td-cat-count">{totalResources}</span>
              </div>
            </div>
            <div className="td-cat">
              <div className="td-cat-head">
                <span className="td-cat-name">Reseñas recibidas</span>
                <span className="td-cat-count">{totalReviews}</span>
              </div>
            </div>
            <div className="td-cat">
              <div className="td-cat-head">
                <span className="td-cat-name">Cursos creados</span>
                <span className="td-cat-count">{totalCourses}</span>
              </div>
            </div>
            <div className="td-cat">
              <div className="td-cat-head">
                <span className="td-cat-name">Estudiantes</span>
                <span className="td-cat-count">{totalStudents}</span>
              </div>
            </div>
            <div className="td-cat">
              <div className="td-cat-head">
                <span className="td-cat-name">Descargas</span>
                <span className="td-cat-count">{totalDownloads.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Resources table */}
      <div className="td-panel">
        <div className="td-table-head">
          <h3>Recursos destacados</h3>
          <Link to="/teacher/my-uploads" className="td-viewall">Ver todos</Link>
        </div>
        {topResources.length > 0 ? (
          <table className="td-table">
            <thead>
              <tr>
                <th>Recurso</th>
                <th>Tipo</th>
                <th>Descargas</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {topResources.map((r) => (
                <tr key={r.id}>
                  <td className="td-table-title">{r.title}</td>
                  <td>
                    <span className={`td-type td-type--${(r.fileType || r.type || '').toLowerCase()}`}>
                      {r.fileType || r.type || '--'}
                    </span>
                  </td>
                  <td className="td-table-dl">{r.downloadCount ?? r.downloads ?? 0}</td>
                  <td className="td-table-date">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : r.date ?? '--'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#9ca3af', fontSize: 14 }}>No hay recursos destacados aún.</p>
        )}
      </div>

      {/* Quick actions */}
      <div className="td-actions">
        <Link to="/teacher/upload" className="td-act td-act--purple">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Subir recurso
        </Link>
        <Link to="/teacher/my-uploads" className="td-act td-act--blue">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          Mis recursos
        </Link>
        <Link to="/teacher/categories" className="td-act td-act--emerald">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          Categorías
        </Link>
        <Link to="/browse" className="td-act td-act--amber">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Explorar
        </Link>
      </div>
    </div>
  );
};

export default TeacherDashboard;
