import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useResourceStore from '../store/resourceStore';
import useCategoryStore from '../store/categoryStore';
import './BrowsePage.css';

const FILE_TYPES_LIST = [
  { id: 'ALL', label: 'Todos' },
  { id: 'PDF', label: 'PDF' },
  { id: 'VIDEO', label: 'Video' },
  { id: 'IMAGE', label: 'Imagen' },
  { id: 'DOCUMENT', label: 'Documento' },
  { id: 'OTHER', label: 'Otro' },
];

const TYPE_CONFIG = {
  PDF:      { color: '#dc2626', bg: '#fef2f2', icon: 'pdf' },
  VIDEO:    { color: '#7c3aed', bg: '#f5f3ff', icon: 'video' },
  IMAGE:    { color: '#059669', bg: '#ecfdf5', icon: 'image' },
  DOCUMENT: { color: '#2563eb', bg: '#eff6ff', icon: 'doc' },
  OTHER:    { color: '#64748b', bg: '#f8fafc', icon: 'doc' },
};

const TypeIcon = ({ type, size = 40 }) => {
  const s = size;
  const icons = {
    pdf: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15v-2h2a1 1 0 1 1 0 2H9z"/></svg>,
    video: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    image: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    doc: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  };
  return icons[type] || icons.doc;
};

const formatSize = (bytes) => {
  if (!bytes) return '—';
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1048576).toFixed(1)} MB`;
};

const BrowsePage = () => {
  const { isTeacher } = useAuth();
  const { resources, pagination, loading, fetchResources } = useResourceStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const params = { page: 1, limit: 20 };
    if (search) params.search = search;
    if (catFilter) params.categoryId = catFilter;
    if (typeFilter !== 'ALL') params.fileType = typeFilter;
    fetchResources(params);
  }, [search, catFilter, typeFilter]);

  const clearFilters = () => {
    setSearch('');
    setCatFilter('');
    setTypeFilter('ALL');
    setSortBy('recent');
  };

  const hasFilters = search || catFilter || typeFilter !== 'ALL';

  return (
    <div className="bp">
      <div className="bp-head">
        <div>
          <h1>Explorar recursos</h1>
          <p>{pagination?.total || 0} recursos disponibles</p>
        </div>
        {isTeacher && (
          <Link to="/teacher/upload" className="bp-upload-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Subir recurso
          </Link>
        )}
      </div>

      <div className="bp-search">
        <svg className="bp-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Buscar por título, descripción..." value={search} onChange={(e) => setSearch(e.target.value)} className="bp-search-input" />
        {search && (
          <button className="bp-search-clear" onClick={() => setSearch('')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>

      <div className="bp-filters">
        <div className="bp-filter-row">
          <div className="bp-filter-group">
            <label>Categoría</label>
            <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
              <option value="">Todas</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="bp-filter-group">
            <label>Tipo</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              {FILE_TYPES_LIST.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div className="bp-filter-group">
            <label>Ordenar por</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">Más recientes</option>
              <option value="popular">Más descargados</option>
              <option value="alpha">Alfabético</option>
            </select>
          </div>
          {hasFilters && (
            <button className="bp-clear-btn" onClick={clearFilters}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Limpiar
            </button>
          )}
        </div>

        <div className="bp-pills">
          {FILE_TYPES_LIST.map(t => (
            <button
              key={t.id}
              className={`bp-pill ${typeFilter === t.id ? 'bp-pill--active' : ''}`}
              onClick={() => setTypeFilter(t.id === typeFilter ? 'ALL' : t.id)}
              style={typeFilter === t.id && t.id !== 'ALL' ? { background: TYPE_CONFIG[t.id]?.color, borderColor: TYPE_CONFIG[t.id]?.color } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bp-empty"><p>Cargando...</p></div>
      ) : resources.length === 0 ? (
        <div className="bp-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <p>No se encontraron recursos</p>
          <button className="bp-empty-btn" onClick={clearFilters}>Limpiar filtros</button>
        </div>
      ) : (
        <div className="bp-grid">
          {resources.map((r) => {
            const cfg = TYPE_CONFIG[r.fileType] || TYPE_CONFIG.OTHER;
            const catName = r.subcategory?.category?.name || '';
            const authorName = r.teacher?.name || 'Desconocido';
            return (
              <Link to={`/resource/${r.id}`} key={r.id} className="bp-card">
                <div className="bp-card-preview" style={{ background: cfg.bg }}>
                  <div className="bp-card-nopreview" style={{ color: cfg.color }}>
                    <TypeIcon type={cfg.icon} size={48} />
                  </div>
                  <span className="bp-card-type" style={{ background: cfg.color }}>{r.fileType}</span>
                </div>
                <div className="bp-card-body">
                  <h3 className="bp-card-title">{r.title}</h3>
                  <p className="bp-card-desc">{r.description}</p>
                  <div className="bp-card-meta">
                    <span className="bp-card-cat">{catName}</span>
                    <span className="bp-card-dot">·</span>
                    <span>{formatSize(r.fileSize)}</span>
                    <span className="bp-card-dot">·</span>
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="bp-card-footer">
                    <div className="bp-card-author">
                      <div className="bp-card-avatar" style={{ background: cfg.color }}>{authorName.charAt(0)}</div>
                      <span>{authorName}</span>
                    </div>
                    <div className="bp-card-dl">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      {r.downloadCount}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrowsePage;
