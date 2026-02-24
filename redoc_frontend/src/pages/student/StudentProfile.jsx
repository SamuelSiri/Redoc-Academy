import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { statsService } from '../../services/statsService';
import toast from 'react-hot-toast';
import './StudentProfile.css';

const StudentProfilePage = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await statsService.getStudentStats();
        setStats(data.data?.stats || data.stats || null);
      } catch {
        // stats not critical
      }
      setStatsLoading(false);
    };
    loadStats();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authService.updateProfile({ name, bio });
      toast.success('Perfil actualizado');
    } catch {
      toast.error('Error al actualizar perfil');
    }
    setSaving(false);
  };

  const initial = (user?.name || 'E').charAt(0).toUpperCase();

  const ACTIVITY_STATS = [
    { label: 'Descargas', value: stats?.downloads ?? 0, color: '#2563eb', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> },
    { label: 'Inscripciones', value: stats?.enrollments ?? 0, color: '#059669', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
    { label: 'Favoritos', value: stats?.favorites ?? 0, color: '#dc2626', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
    { label: 'Certificados', value: stats?.certificates ?? 0, color: '#7c3aed', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg> },
  ];

  const roleLabel = user?.role === 'TEACHER' ? 'Maestro' : user?.role === 'ADMIN' ? 'Administrador' : 'Estudiante';
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="sp">
      <div className="sp-head">
        <div className="sp-head-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div>
          <h1>Mi perfil</h1>
          <p>Información personal y estadísticas</p>
        </div>
      </div>

      <div className="sp-main">
        {/* Left - profile card */}
        <div className="sp-left">
          <div className="sp-card">
            <div className="sp-avatar-area">
              <div className="sp-avatar">{initial}</div>
              <div className="sp-role-badge">{roleLabel}</div>
            </div>
            <div className="sp-card-form">
              <div className="sp-field">
                <label>Nombre completo</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="sp-field">
                <label>Correo electrónico</label>
                <input type="email" value={email} disabled />
                <span className="sp-hint">El correo no se puede cambiar</span>
              </div>
              <div className="sp-field">
                <label>Biografía</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Cuéntanos sobre ti..." />
                <span className="sp-char">{bio.length}/200</span>
              </div>
              <button className="sp-save" onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="sp-section">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Preferencias
            </h2>
            <div className="sp-prefs">
              <div className="sp-pref">
                <div>
                  <strong>Notificaciones por email</strong>
                  <span>Recibe alertas de nuevos recursos</span>
                </div>
                <label className="sp-toggle"><input type="checkbox" defaultChecked /><span /></label>
              </div>
              <div className="sp-pref">
                <div>
                  <strong>Recursos recomendados</strong>
                  <span>Sugerencias basadas en tu actividad</span>
                </div>
                <label className="sp-toggle"><input type="checkbox" defaultChecked /><span /></label>
              </div>
              <div className="sp-pref">
                <div>
                  <strong>Historial de descargas</strong>
                  <span>Guardar registro de descargas</span>
                </div>
                <label className="sp-toggle"><input type="checkbox" defaultChecked /><span /></label>
              </div>
            </div>
          </div>
        </div>

        {/* Right - stats */}
        <div className="sp-right">
          {/* Activity stats */}
          <div className="sp-section">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              Actividad
            </h2>
            <div className="sp-act-grid">
              {statsLoading ? (
                <p style={{ color: '#9ca3af', fontSize: 14, padding: '12px 0' }}>Cargando estadísticas...</p>
              ) : (
                ACTIVITY_STATS.map((s, i) => (
                  <div key={i} className="sp-act-card" style={{ background: s.color }}>
                    <div className="sp-act-icon">{s.icon}</div>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Account */}
          <div className="sp-section">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Cuenta
            </h2>
            <div className="sp-account-info">
              <div className="sp-acc-row"><span>Rol</span><strong>{roleLabel}</strong></div>
              <div className="sp-acc-row"><span>Miembro desde</span><strong>{memberSince}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
