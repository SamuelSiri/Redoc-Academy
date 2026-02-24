import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import './Login.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success('¡Bienvenido!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg">
      {/* ======= LEFT — FORM ======= */}
      <div className="lg-left">
        <div className="lg-card">
          <div className="lg-logo">
            <div className="lg-logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <span>Redoc Academy</span>
          </div>

          <h2 className="lg-title">Inicia sesión en tu cuenta</h2>

          <button type="button" className="lg-google" onClick={() => window.location.href = 'http://localhost:3000/api/v1/auth/google'}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>

          <div className="lg-sep"><span>o</span></div>

          <form onSubmit={handleSubmit} className="lg-form">
            <div className="lg-field">
              <label htmlFor="lg-email">Correo electrónico</label>
              <input
                id="lg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@correo.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="lg-field">
              <div className="lg-field-row">
                <label htmlFor="lg-pass">Contraseña</label>
                <a href="#" className="lg-forgot">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="lg-pass-box">
                <input
                  id="lg-pass"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  autoComplete="current-password"
                />
                <button type="button" className="lg-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1} aria-label="Mostrar contraseña">
                  {showPw ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="lg-submit" disabled={loading}>
              {loading ? <span className="lg-spinner" /> : 'Iniciar sesión'}
            </button>
          </form>

          <p className="lg-footer">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </div>
      </div>

      {/* ======= RIGHT — ABSTRACT SHAPES ======= */}
      <div className="lg-hero">
        <div className="lg-hero-grid" />
        <div className="lg-hero-orb lg-hero-orb--1" />
        <div className="lg-hero-orb lg-hero-orb--2" />

        {/* Geometric shapes */}
        <div className="lg-shape-tri1" />
        <div className="lg-shape-tri2" />
        <div className="lg-shape-tri3" />
        <div className="lg-shape-circ1" />
        <div className="lg-shape-circ2" />
        <div className="lg-shape-circ3" />
        <div className="lg-shape-plus" />
        <div className="lg-shape-hex" />
        <div className="lg-shape-book" />
        <div className="lg-shape-ring" />
        <div className="lg-shape-sq" />
      </div>
    </div>
  );
};

export default LoginForm;