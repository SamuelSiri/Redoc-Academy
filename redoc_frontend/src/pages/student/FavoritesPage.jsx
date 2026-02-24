import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useFavoriteStore from '../../store/favoriteStore';
import './FavoritesPage.css';

const TYPE_CONFIG = {
  PDF: { color: '#dc2626', bg: '#fef2f2' },
  VIDEO: { color: '#7c3aed', bg: '#f5f3ff' },
  IMAGE: { color: '#059669', bg: '#ecfdf5' },
  DOCUMENT: { color: '#2563eb', bg: '#eff6ff' },
  CODE: { color: '#ea580c', bg: '#fff7ed' },
  LINK: { color: '#0891b2', bg: '#ecfeff' },
  AUDIO: { color: '#db2777', bg: '#fdf2f8' },
};

const FavoritesPage = () => {
  const { favorites, loading, fetchFavorites, removeFavorite } = useFavoriteStore();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('ALL');

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const cats = useMemo(
    () => [...new Set(favorites.map((f) => f.resource?.subcategory?.category?.name).filter(Boolean))],
    [favorites]
  );

  const filtered = useMemo(() => {
    let res = [...favorites];
    if (search) {
      const q = search.toLowerCase();
      res = res.filter((f) => f.resource?.title?.toLowerCase().includes(q));
    }
    if (filterCat !== 'ALL') {
      res = res.filter((f) => f.resource?.subcategory?.category?.name === filterCat);
    }
    return res;
  }, [favorites, search, filterCat]);

  const handleRemoveFavorite = async (resourceId) => {
    try {
      await removeFavorite(resourceId);
      toast.success('Eliminado de favoritos');
    } catch {
      toast.error('Error al eliminar de favoritos');
    }
  };

  if (loading && favorites.length === 0) {
    return (
      <div className="fav">
        <div className="fav-head">
          <div className="fav-head-left">
            <div className="fav-head-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <div>
              <h1>Mis favoritos</h1>
              <p>Cargando...</p>
            </div>
          </div>
        </div>
        <div className="fav-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="fav-card" style={{ opacity: 0.5 }}>
              <div className="fav-card-top" style={{ background: '#f3f4f6' }} />
              <div className="fav-card-body">
                <div style={{ height: 14, width: '80%', background: '#e5e7eb', borderRadius: 4, marginBottom: 8 }} />
                <div style={{ height: 10, width: '50%', background: '#f3f4f6', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fav">
      <div className="fav-head">
        <div className="fav-head-left">
          <div className="fav-head-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <div>
            <h1>Mis favoritos</h1>
            <p>{favorites.length} recursos guardados</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="fav-toolbar">
        <div className="fav-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Buscar favoritos..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="ALL">Todas las categorías</option>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="fav-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <p>No tienes favoritos aún</p>
          <Link to="/browse" className="fav-empty-btn">Explorar recursos</Link>
        </div>
      ) : (
        <div className="fav-grid">
          {filtered.map(fav => {
            const resource = fav.resource;
            const fileType = resource?.fileType || 'PDF';
            const tc = TYPE_CONFIG[fileType] || TYPE_CONFIG.PDF;
            return (
              <div key={fav.id} className="fav-card">
                <div className="fav-card-top" style={{ background: tc.bg }}>
                  <div style={{ color: tc.color }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <span className="fav-card-badge" style={{ background: tc.color }}>{fileType}</span>
                  <button className="fav-card-heart" onClick={() => handleRemoveFavorite(fav.resourceId)} title="Quitar de favoritos">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#dc2626" stroke="#dc2626" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                </div>
                <div className="fav-card-body">
                  <Link to={`/resource/${resource?.id}`} className="fav-card-title">{resource?.title}</Link>
                  <span className="fav-card-author">{resource?.teacher?.name}</span>
                  <div className="fav-card-foot">
                    <span className="fav-card-cat">{resource?.subcategory?.category?.name}</span>
                    <span className="fav-card-dl">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      {resource?.downloadCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
