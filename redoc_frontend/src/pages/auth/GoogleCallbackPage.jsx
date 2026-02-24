import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuthFromGoogle = useAuthStore((s) => s.setAuthFromGoogle);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userParam = searchParams.get('user');

    if (accessToken && refreshToken && userParam) {
      try {
        const user = JSON.parse(userParam);
        setAuthFromGoogle(user, accessToken, refreshToken);

        // Clean up registration role from localStorage
        localStorage.removeItem('register_role');

        navigate('/', { replace: true });
      } catch {
        navigate('/login', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '12px' }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e5e7eb', borderTopColor: '#5624d0', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <p style={{ color: '#6a6f73', fontSize: 14 }}>Autenticando con Google...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default GoogleCallbackPage;
