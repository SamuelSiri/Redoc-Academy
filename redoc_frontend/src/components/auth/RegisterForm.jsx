import { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegisterForm.css';

const RegisterForm = () => {
  const [role, setRole] = useState('');

  const handleGoogleRegister = () => {
    if (!role) return;
    localStorage.setItem('register_role', role);
    window.location.href = `http://localhost:3000/api/v1/auth/google?role=${role}`;
  };

  return (
    <div className="rg">
      {/* LEFT — FORM */}
      <div className="rg-left">
        <div className="rg-card">
          <div className="rg-logo">
            <div className="rg-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <span>Redoc Academy</span>
          </div>

          <h2 className="rg-title">Crea tu cuenta</h2>
          <p className="rg-subtitle">Selecciona tu rol para comenzar</p>

          {/* Role selection */}
          <div className="rg-roles">
            <button
              type="button"
              className={`rg-role-card ${role === 'STUDENT' ? 'rg-role-card--active' : ''}`}
              onClick={() => setRole('STUDENT')}
            >
              <div className="rg-role-icon rg-role-icon--student">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <div className="rg-role-text">
                <strong>Estudiante</strong>
                <span>Accede a recursos, cursos y materiales educativos</span>
              </div>
              <div className={`rg-role-check ${role === 'STUDENT' ? 'rg-role-check--on' : ''}`}>
                {role === 'STUDENT' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </div>
            </button>

            <button
              type="button"
              className={`rg-role-card ${role === 'TEACHER' ? 'rg-role-card--active' : ''}`}
              onClick={() => setRole('TEACHER')}
            >
              <div className="rg-role-icon rg-role-icon--teacher">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="rg-role-text">
                <strong>Maestro</strong>
                <span>Sube recursos, crea cursos y gestiona contenido</span>
              </div>
              <div className={`rg-role-check ${role === 'TEACHER' ? 'rg-role-check--on' : ''}`}>
                {role === 'TEACHER' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </div>
            </button>
          </div>

          {/* Google button */}
          <button
            type="button"
            className="rg-google"
            onClick={handleGoogleRegister}
            disabled={!role}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Registrarse con Google
          </button>

          {!role && (
            <p className="rg-hint">Selecciona un rol para continuar</p>
          )}

          <p className="rg-footer">
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </div>

      {/* RIGHT — ABSTRACT SHAPES (same style as login) */}
      <div className="rg-hero">
        <div className="rg-hero-grid" />
        <div className="rg-hero-orb rg-hero-orb--1" />
        <div className="rg-hero-orb rg-hero-orb--2" />
        <div className="rg-shape-tri1" />
        <div className="rg-shape-tri2" />
        <div className="rg-shape-tri3" />
        <div className="rg-shape-circ1" />
        <div className="rg-shape-circ2" />
        <div className="rg-shape-circ3" />
        <div className="rg-shape-plus" />
        <div className="rg-shape-hex" />
        <div className="rg-shape-ring" />
        <div className="rg-shape-sq" />
      </div>
    </div>
  );
};

export default RegisterForm;
