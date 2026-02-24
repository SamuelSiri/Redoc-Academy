import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import './AdminDashboard.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await adminService.getStats();
        setStats(data.data.stats);
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="adm"><p>Cargando...</p></div>;
  if (!stats) return <div className="adm"><p>Error al cargar estadísticas</p></div>;

  return (
    <div className="adm">
      <div className="adm-head">
        <h1>Panel de Administración</h1>
      </div>

      <div className="adm-stats">
        <div className="adm-stat" style={{ borderLeftColor: '#7c3aed' }}>
          <div className="adm-stat-value">{stats.totalUsers}</div>
          <div className="adm-stat-label">Usuarios</div>
        </div>
        <div className="adm-stat" style={{ borderLeftColor: '#2563eb' }}>
          <div className="adm-stat-value">{stats.totalCourses}</div>
          <div className="adm-stat-label">Cursos</div>
        </div>
        <div className="adm-stat" style={{ borderLeftColor: '#10b981' }}>
          <div className="adm-stat-value">{stats.totalResources}</div>
          <div className="adm-stat-label">Recursos</div>
        </div>
        <div className="adm-stat" style={{ borderLeftColor: '#f59e0b' }}>
          <div className="adm-stat-value">{stats.totalEnrollments}</div>
          <div className="adm-stat-label">Inscripciones</div>
        </div>
      </div>

      <div className="adm-grid">
        <div className="adm-panel">
          <h2>Usuarios por Rol</h2>
          <div className="adm-roles">
            {Object.entries(stats.usersByRole || {}).map(([role, count]) => (
              <div key={role} className="adm-role">
                <span className="adm-role-name">{role}</span>
                <span className="adm-role-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="adm-panel">
          <h2>Usuarios recientes</h2>
          <div className="adm-recent">
            {stats.recentUsers?.map((u) => (
              <div key={u.id} className="adm-recent-item">
                <div className="adm-recent-avatar">{u.name?.charAt(0)}</div>
                <div className="adm-recent-info">
                  <strong>{u.name}</strong>
                  <span>{u.email}</span>
                </div>
                <span className={`adm-recent-role adm-recent-role--${u.role.toLowerCase()}`}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="adm-actions">
        <Link to="/admin/users" className="adm-action-btn">Gestionar usuarios</Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
