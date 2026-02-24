import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import useNotificationStore from '../../store/notificationStore';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, fetchNotifications, fetchUnreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showNotifs) fetchNotifications({ limit: 10 });
  }, [showNotifs]);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotifClick = async (notif) => {
    if (!notif.read) await markAsRead(notif.id);
    if (notif.link) { navigate(notif.link); setShowNotifs(false); }
  };

  return (
    <header className="nav">
      <div className="nav-left">
        <div className="nav-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          <span>Redoc Academy</span>
        </div>
      </div>
      <div className="nav-right">
        <div className="nav-notif-wrap" ref={notifRef}>
          <button className="nav-notif-btn" onClick={() => setShowNotifs(!showNotifs)} title="Notificaciones">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            {unreadCount > 0 && <span className="nav-notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </button>
          {showNotifs && (
            <div className="nav-notif-dropdown">
              <div className="nav-notif-header">
                <strong>Notificaciones</strong>
                {unreadCount > 0 && <button className="nav-notif-readall" onClick={markAllAsRead}>Marcar todo leído</button>}
              </div>
              <div className="nav-notif-list">
                {notifications.length === 0 ? (
                  <p className="nav-notif-empty">Sin notificaciones</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`nav-notif-item ${!n.read ? 'nav-notif-item--unread' : ''}`} onClick={() => handleNotifClick(n)}>
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <div className="nav-user">
          <div className="nav-avatar">{user?.name?.charAt(0) || 'U'}</div>
          <span className="nav-username">{user?.name}</span>
          <span className="nav-role">{user?.role}</span>
        </div>
        <button className="nav-logout" onClick={handleLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Salir
        </button>
      </div>
    </header>
  );
};

export default Navbar;
