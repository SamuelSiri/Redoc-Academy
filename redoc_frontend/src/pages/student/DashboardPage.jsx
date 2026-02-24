import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { statsService } from '../../services/statsService';
import useCategoryStore from '../../store/categoryStore';
import './DashboardPage.css';

const CAT_COLORS = ['#7c3aed', '#2563eb', '#059669', '#d97706', '#dc2626', '#0891b2'];

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
    const fetchStats = async () => {
      try {
        setLoading(true);
        const { data } = await statsService.getStudentStats();
        setStats(data.data?.stats || data.stats);
      } catch (err) {
        console.error('Error fetching student stats:', err);
        setError('No se pudieron cargar las estadisticas.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="sd">
        <div className="sd-welcome">
          <div className="sd-welcome-left">
            <h1>Cargando...</h1>
            <p>Obteniendo tus datos del dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sd">
        <div className="sd-welcome">
          <div className="sd-welcome-left">
            <h1>Error</h1>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Inscripciones', value: stats?.enrollments ?? 0, color: '#7c3aed', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
    { label: 'Cursos completados', value: stats?.completedCourses ?? 0, color: '#059669', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
    { label: 'Certificados', value: stats?.certificates ?? 0, color: '#d97706', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg> },
    { label: 'Favoritos', value: stats?.favorites ?? 0, color: '#dc2626', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
    { label: 'Descargas', value: stats?.downloads ?? 0, color: '#2563eb', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> },
  ];

  const recentEnrollments = stats?.recentEnrollments ?? [];

  return (
    <div className="sd">
      {/* Welcome */}
      <div className="sd-welcome">
        <div className="sd-welcome-left">
          <h1>Hola, {user?.name?.split(' ')[0] || 'Estudiante'}!</h1>
          <p>Continua aprendiendo. Tienes {stats?.totalResources ?? 0} recursos disponibles.</p>
        </div>
        <Link to="/browse" className="sd-browse-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Explorar recursos
        </Link>
      </div>

      {/* Stats */}
      <div className="sd-stats">
        {statCards.map((s, i) => (
          <div key={i} className="sd-stat" style={{ background: s.color }}>
            <div className="sd-stat-icon">{s.icon}</div>
            <div>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main 2 cols */}
      <div className="sd-main">
        {/* Left */}
        <div className="sd-main-left">
          {/* Recent enrollments */}
          <div className="sd-section">
            <div className="sd-section-head">
              <h2>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Inscripciones recientes
              </h2>
              <Link to="/student/enrollments" className="sd-see-all">Ver todo</Link>
            </div>
            <div className="sd-recent-list">
              {recentEnrollments.length === 0 ? (
                <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
                  No tienes inscripciones recientes.
                </p>
              ) : (
                recentEnrollments.map((enrollment) => (
                  <Link to={`/courses/${enrollment.courseId}`} key={enrollment.id} className="sd-recent-item">
                    <div className="sd-recent-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    </div>
                    <div className="sd-recent-info">
                      <span className="sd-recent-title">{enrollment.course?.title || enrollment.courseTitle}</span>
                      <span className="sd-recent-meta">
                        Inscrito el {new Date(enrollment.enrolledAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <span className="sd-recent-badge" style={{
                      background: enrollment.status === 'completed' ? '#ecfdf5' : '#eff6ff',
                      color: enrollment.status === 'completed' ? '#059669' : '#2563eb'
                    }}>
                      {enrollment.status === 'completed' ? 'Completado' : 'En curso'}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="sd-main-right">
          {/* Categories */}
          <div className="sd-section">
            <div className="sd-section-head">
              <h2>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                Categorias
              </h2>
              <Link to="/browse" className="sd-see-all">Ver todas</Link>
            </div>
            <div className="sd-cats">
              {categories.slice(0, 6).map((c, i) => (
                <Link to="/browse" key={c.id} className="sd-cat-item">
                  <div className="sd-cat-icon" style={{ background: `${CAT_COLORS[i % CAT_COLORS.length]}15`, color: CAT_COLORS[i % CAT_COLORS.length] }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <span className="sd-cat-name">{c.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="sd-section">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Acciones rapidas
            </h2>
            <div className="sd-quick">
              <Link to="/browse" className="sd-quick-btn sd-quick-btn--purple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Explorar
              </Link>
              <Link to="/student/downloads" className="sd-quick-btn sd-quick-btn--blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Descargas
              </Link>
              <Link to="/student/favorites" className="sd-quick-btn sd-quick-btn--red">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                Favoritos
              </Link>
              <Link to="/student/profile" className="sd-quick-btn sd-quick-btn--emerald">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Mi perfil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
