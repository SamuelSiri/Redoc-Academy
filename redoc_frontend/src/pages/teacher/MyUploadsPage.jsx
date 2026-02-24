import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useResourceStore from '../../store/resourceStore';
import './MyUploadsPage.css';

const TYPE_CONFIG = {
  PDF:      { color: '#dc2626', bg: '#fef2f2' },
  VIDEO:    { color: '#7c3aed', bg: '#f5f3ff' },
  IMAGE:    { color: '#059669', bg: '#ecfdf5' },
  DOCUMENT: { color: '#2563eb', bg: '#eff6ff' },
  OTHER:    { color: '#64748b', bg: '#f8fafc' },
};

const formatDate = (d) => {
  const date = new Date(d);
  return date.toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatFileSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const MyUploadsPage = () => {
  const { resources, pagination, loading, fetchMyUploads, deleteResource } = useResourceStore();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [sortBy, setSortBy] = useState('recent');
  const [selected, setSelected] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchMyUploads();
  }, [fetchMyUploads]);

  const filtered = useMemo(() => {
    let res = [...resources];
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.subcategory?.category?.name?.toLowerCase().includes(q) ||
        r.subcategory?.name?.toLowerCase().includes(q)
      );
    }
    if (filterType !== 'ALL') res = res.filter(r => r.fileType === filterType);
    if (sortBy === 'recent') res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === 'popular') res.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
    if (sortBy === 'alpha') res.sort((a, b) => a.title.localeCompare(b.title));
    return res;
  }, [resources, search, filterType, sortBy]);

  const totalDownloads = resources.reduce((a, r) => a + (r.downloadCount || 0), 0);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map(r => r.id));
  };

  const handleDelete = async (id) => {
    try {
      await deleteResource(id);
      setSelected(prev => prev.filter(x => x !== id));
      setDeleteConfirm(null);
      toast.success('Recurso eliminado');
    } catch {
      toast.error('Error al eliminar el recurso');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selected.map(id => deleteResource(id)));
      toast.success(`${selected.length} recursos eliminados`);
      setSelected([]);
    } catch {
      toast.error('Error al eliminar recursos');
    }
  };

  if (loading && resources.length === 0) {
    return (
      <div className="mu">
        <div className="mu-head">
          <div className="mu-head-left">
            <div className="mu-head-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div>
              <h1>Mis recursos</h1>
              <p>Gestiona todo tu material educativo</p>
            </div>
          </div>
          <Link to="/teacher/upload" className="mu-upload-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Subir nuevo
          </Link>
        </div>
        <div className="mu-empty">
          <p>Cargando recursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mu">
      {/* Header */}
      <div className="mu-head">
        <div className="mu-head-left">
          <div className="mu-head-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div>
            <h1>Mis recursos</h1>
            <p>Gestiona todo tu material educativo</p>
          </div>
        </div>
        <Link to="/teacher/upload" className="mu-upload-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Subir nuevo
        </Link>
      </div>

      {/* Stats */}
      <div className="mu-stats">
        <div className="mu-stat mu-stat--purple">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <div>
            <strong>{pagination?.total || resources.length}</strong>
            <span>Total</span>
          </div>
        </div>
        <div className="mu-stat mu-stat--emerald">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <div>
            <strong>{totalDownloads.toLocaleString()}</strong>
            <span>Descargas</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mu-toolbar">
        <div className="mu-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Buscar recursos..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="mu-filters">
          <select value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="ALL">Todos los tipos</option>
            {Object.keys(TYPE_CONFIG).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="recent">Mas recientes</option>
            <option value="popular">Mas descargados</option>
            <option value="alpha">Alfabetico</option>
          </select>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="mu-bulk">
          <span>{selected.length} seleccionados</span>
          <button className="mu-bulk-del" onClick={handleBulkDelete}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            Eliminar
          </button>
          <button className="mu-bulk-clear" onClick={() => setSelected([])}>Cancelar</button>
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="mu-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <p>No se encontraron recursos</p>
        </div>
      ) : (
        <div className="mu-table-wrap">
          <table className="mu-table">
            <thead>
              <tr>
                <th className="mu-th-check">
                  <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} />
                </th>
                <th>Recurso</th>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Descargas</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const tc = TYPE_CONFIG[r.fileType] || TYPE_CONFIG.OTHER;
                return (
                  <tr key={r.id} className={selected.includes(r.id) ? 'mu-row--selected' : ''}>
                    <td className="mu-td-check">
                      <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)} />
                    </td>
                    <td>
                      <div className="mu-res">
                        <div className="mu-res-icon" style={{ background: tc.bg, color: tc.color }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </div>
                        <div>
                          <span className="mu-res-title">{r.title}</span>
                          <span className="mu-res-size">{formatFileSize(r.fileSize)}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="mu-badge" style={{ background: tc.bg, color: tc.color }}>{r.fileType}</span></td>
                    <td>
                      <span className="mu-cat">{r.subcategory?.category?.name || '—'}</span>
                      <span className="mu-sub">{r.subcategory?.name || ''}</span>
                    </td>
                    <td className="mu-td-num">{(r.downloadCount || 0).toLocaleString()}</td>
                    <td className="mu-td-date">{formatDate(r.createdAt)}</td>
                    <td>
                      <div className="mu-actions">
                        <Link to={`/resource/${r.id}`} className="mu-act mu-act--view" title="Ver">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </Link>
                        <button className="mu-act mu-act--edit" title="Editar">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        {deleteConfirm === r.id ? (
                          <div className="mu-del-confirm">
                            <button className="mu-del-yes" onClick={() => handleDelete(r.id)}>Si</button>
                            <button className="mu-del-no" onClick={() => setDeleteConfirm(null)}>No</button>
                          </div>
                        ) : (
                          <button className="mu-act mu-act--del" title="Eliminar" onClick={() => setDeleteConfirm(r.id)}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer count */}
      <div className="mu-footer">
        Mostrando {filtered.length} de {pagination?.total || resources.length} recursos
      </div>
    </div>
  );
};

export default MyUploadsPage;
