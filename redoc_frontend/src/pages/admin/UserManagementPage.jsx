import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';
import './UserManagement.css';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = { page: 1, limit: 20 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const { data } = await adminService.getUsers(params);
      setUsers(data.data);
      setPagination(data.pagination);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, [search, roleFilter]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUser(userId, { role: newRole });
      toast.success('Rol actualizado');
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      await adminService.updateUser(userId, { isActive: !isActive });
      toast.success(isActive ? 'Usuario desactivado' : 'Usuario activado');
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await adminService.deleteUser(userId);
      toast.success('Usuario eliminado');
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="um">
      <div className="um-head">
        <h1>Gestión de Usuarios</h1>
        <span>{pagination.total || 0} usuarios</span>
      </div>

      <div className="um-filters">
        <div className="um-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Buscar usuarios..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">Todos los roles</option>
          <option value="STUDENT">Estudiante</option>
          <option value="TEACHER">Profesor</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <div className="um-table-wrap">
        <table className="um-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Registrado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No hay usuarios</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="um-user">
                      <div className="um-avatar">{user.name?.charAt(0)}</div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)} className="um-role-select">
                      <option value="STUDENT">Estudiante</option>
                      <option value="TEACHER">Profesor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span className={`um-status ${user.isActive ? 'um-status--active' : 'um-status--inactive'}`}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString('es-ES')}</td>
                  <td>
                    <div className="um-actions">
                      <button className="um-action-btn" onClick={() => handleToggleActive(user.id, user.isActive)} title={user.isActive ? 'Desactivar' : 'Activar'}>
                        {user.isActive ? '🔒' : '🔓'}
                      </button>
                      <button className="um-action-btn um-action-btn--danger" onClick={() => handleDelete(user.id)} title="Eliminar">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;
