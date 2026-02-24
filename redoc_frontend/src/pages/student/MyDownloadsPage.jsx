import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { downloadService } from '../../services/downloadService';
import './MyDownloadsPage.css';

const TYPE_CONFIG = {
  PDF: { color: '#dc2626', bg: '#fef2f2' },
  VIDEO: { color: '#7c3aed', bg: '#f5f3ff' },
  IMAGE: { color: '#059669', bg: '#ecfdf5' },
  DOCUMENT: { color: '#2563eb', bg: '#eff6ff' },
  CODE: { color: '#ea580c', bg: '#fff7ed' },
  LINK: { color: '#0891b2', bg: '#ecfeff' },
  AUDIO: { color: '#db2777', bg: '#fdf2f8' },
  TEXT: { color: '#64748b', bg: '#f8fafc' },
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString('es-DO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1);
  return `${size} ${units[i]}`;
};

const MyDownloadsPage = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        setLoading(true);
        const { data } = await downloadService.getMyDownloads();
        setDownloads(data.data || []);
      } catch (err) {
        console.error('Error fetching downloads:', err);
        setError('No se pudieron cargar las descargas.');
        toast.error('Error al cargar las descargas');
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, []);

  const filtered = useMemo(() => {
    let res = [...downloads];
    if (search) {
      const q = search.toLowerCase();
      res = res.filter((d) => d.resource?.title?.toLowerCase().includes(q));
    }
    if (filterType !== 'ALL') {
      res = res.filter((d) => d.resource?.fileType === filterType);
    }
    return res;
  }, [downloads, search, filterType]);

  if (loading) {
    return (
      <div className="mdl">
        <div className="mdl-head">
          <div className="mdl-head-left">
            <div className="mdl-head-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
            <div>
              <h1>Mis descargas</h1>
              <p>Cargando...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mdl">
        <div className="mdl-head">
          <div className="mdl-head-left">
            <div className="mdl-head-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
            <div>
              <h1>Mis descargas</h1>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mdl">
      <div className="mdl-head">
        <div className="mdl-head-left">
          <div className="mdl-head-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </div>
          <div>
            <h1>Mis descargas</h1>
            <p>{downloads.length} recursos descargados</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mdl-stats">
        <div className="mdl-stat mdl-stat--blue">
          <strong>{downloads.length}</strong><span>Total</span>
        </div>
        <div className="mdl-stat mdl-stat--red">
          <strong>{downloads.filter(d => d.resource?.fileType === 'PDF').length}</strong><span>PDFs</span>
        </div>
        <div className="mdl-stat mdl-stat--purple">
          <strong>{downloads.filter(d => d.resource?.fileType === 'VIDEO').length}</strong><span>Videos</span>
        </div>
        <div className="mdl-stat mdl-stat--emerald">
          <strong>{downloads.filter(d => d.resource?.fileType === 'DOCUMENT').length}</strong><span>Documentos</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mdl-toolbar">
        <div className="mdl-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Buscar descargas..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="ALL">Todos los tipos</option>
          {Object.keys(TYPE_CONFIG).map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="mdl-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <p>No se encontraron descargas</p>
        </div>
      ) : (
        <div className="mdl-list">
          {filtered.map(d => {
            const fileType = d.resource?.fileType || 'TEXT';
            const tc = TYPE_CONFIG[fileType] || TYPE_CONFIG.TEXT;
            return (
              <div key={d.id} className="mdl-item">
                <div className="mdl-item-icon" style={{ background: tc.bg, color: tc.color }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div className="mdl-item-info">
                  <Link to={`/resource/${d.resource?.id}`} className="mdl-item-title">{d.resource?.title}</Link>
                  <span className="mdl-item-meta">
                    {d.resource?.teacher?.name || 'Desconocido'}
                    {' · '}
                    {d.resource?.subcategory?.category?.name || d.resource?.subcategory?.name || 'Sin categoría'}
                    {' · '}
                    {formatFileSize(d.resource?.fileSize)}
                  </span>
                </div>
                <span className="mdl-item-badge" style={{ background: tc.bg, color: tc.color }}>{fileType}</span>
                <span className="mdl-item-date">{formatDate(d.downloadedAt)}</span>
                <div className="mdl-item-actions">
                  <button className="mdl-re" title="Descargar de nuevo">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyDownloadsPage;
