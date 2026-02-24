import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useResourceStore from '../store/resourceStore';
import { favoriteService } from '../services/favoriteService';
import { resourceService } from '../services/resourceService';
import toast from 'react-hot-toast';
import './ResourceView.css';

const TYPE_CONFIG = {
  PDF:        { color: '#dc2626', bg: '#fef2f2', label: 'PDF' },
  VIDEO:      { color: '#7c3aed', bg: '#f5f3ff', label: 'Video' },
  IMAGE:      { color: '#059669', bg: '#ecfdf5', label: 'Imagen' },
  DOCUMENT:   { color: '#2563eb', bg: '#eff6ff', label: 'Documento' },
  CODE:       { color: '#ea580c', bg: '#fff7ed', label: 'Código' },
  LINK:       { color: '#0891b2', bg: '#ecfeff', label: 'Enlace' },
  QR:         { color: '#4f46e5', bg: '#eef2ff', label: 'QR' },
  TEXT:       { color: '#64748b', bg: '#f8fafc', label: 'Texto' },
  AUDIO:      { color: '#db2777', bg: '#fdf2f8', label: 'Audio' },
  COMPRESSED: { color: '#854d0e', bg: '#fefce8', label: 'Comprimido' },
  OTHER:      { color: '#64748b', bg: '#f8fafc', label: 'Otro' },
};

const formatSize = (bytes) => {
  if (!bytes) return '—';
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1048576).toFixed(1)} MB`;
};

const ResourceViewPage = () => {
  const { id } = useParams();
  const { currentResource: resource, loading, error, fetchResourceById, clearCurrent } = useResourceStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    fetchResourceById(id);
    favoriteService.check(id)
      .then(({ data }) => setIsFavorite(data.data?.isFavorite || false))
      .catch(() => {});
    return () => clearCurrent();
  }, [id]);

  const toggleFavorite = async () => {
    setFavLoading(true);
    try {
      if (isFavorite) {
        await favoriteService.remove(id);
        setIsFavorite(false);
        toast.success('Eliminado de favoritos');
      } else {
        await favoriteService.add(id);
        setIsFavorite(true);
        toast.success('Agregado a favoritos');
      }
    } catch {
      toast.error('Error al actualizar favoritos');
    }
    setFavLoading(false);
  };

  if (loading) {
    return (
      <div className="rv">
        <div className="rv-loading">
          <div className="rv-spinner" />
          <p>Cargando recurso...</p>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="rv">
        <div className="rv-error">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <h2>Recurso no encontrado</h2>
          <p>{error || 'El recurso que buscas no existe o fue eliminado.'}</p>
          <Link to="/browse" className="rv-back-btn">Volver a explorar</Link>
        </div>
      </div>
    );
  }

  const typeConf = TYPE_CONFIG[resource.fileType] || TYPE_CONFIG.OTHER;

  return (
    <div className="rv">
      {/* Breadcrumb */}
      <div className="rv-breadcrumb">
        <Link to="/browse">Explorar</Link>
        <span>/</span>
        <span>{resource.title}</span>
      </div>

      <div className="rv-layout">
        {/* Main content */}
        <div className="rv-main">
          {/* Header */}
          <div className="rv-header">
            <div className="rv-type-badge" style={{ background: typeConf.bg, color: typeConf.color }}>
              {typeConf.label}
            </div>
            <h1 className="rv-title">{resource.title}</h1>
            {resource.description && (
              <p className="rv-desc">{resource.description}</p>
            )}
            <div className="rv-meta">
              {resource.uploader && (
                <div className="rv-meta-item">
                  <div className="rv-uploader-avatar">{resource.uploader.name?.charAt(0) || 'U'}</div>
                  <span>{resource.uploader.name}</span>
                </div>
              )}
              <div className="rv-meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>{resource.createdAt ? new Date(resource.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</span>
              </div>
              <div className="rv-meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>{resource.downloadCount ?? 0} descargas</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="rv-tags">
              {(typeof resource.tags === 'string' ? JSON.parse(resource.tags) : resource.tags).map((tag, i) => (
                <span key={i} className="rv-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="rv-sidebar">
          <div className="rv-sidebar-card">
            {/* File info */}
            <div className="rv-file-info">
              <div className="rv-file-icon" style={{ background: typeConf.bg, color: typeConf.color }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <span className="rv-file-type">{typeConf.label}</span>
                {resource.fileSize && <span className="rv-file-size">{formatSize(resource.fileSize)}</span>}
              </div>
            </div>

            {/* Actions */}
            <div className="rv-actions">
              {resource.fileType === 'LINK' && resource.linkUrl ? (
                <a href={resource.linkUrl} target="_blank" rel="noopener noreferrer" className="rv-download-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Abrir enlace
                </a>
              ) : (
                <a href={resourceService.getDownloadUrl(resource.id)} className="rv-download-btn" download>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Descargar
                </a>
              )}

              <button className={`rv-fav-btn ${isFavorite ? 'rv-fav-btn--active' : ''}`} onClick={toggleFavorite} disabled={favLoading}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                {isFavorite ? 'En favoritos' : 'Agregar a favoritos'}
              </button>
            </div>

            {/* Details */}
            <div className="rv-details">
              {resource.category && (
                <div className="rv-detail-row">
                  <span className="rv-detail-label">Categoría</span>
                  <span className="rv-detail-value">{resource.category.name}</span>
                </div>
              )}
              {resource.subcategory && (
                <div className="rv-detail-row">
                  <span className="rv-detail-label">Subcategoría</span>
                  <span className="rv-detail-value">{resource.subcategory.name}</span>
                </div>
              )}
              {resource.difficulty && (
                <div className="rv-detail-row">
                  <span className="rv-detail-label">Dificultad</span>
                  <span className="rv-detail-value">{resource.difficulty === 'BASIC' ? 'Básico' : resource.difficulty === 'INTERMEDIATE' ? 'Intermedio' : 'Avanzado'}</span>
                </div>
              )}
              {resource.visibility && (
                <div className="rv-detail-row">
                  <span className="rv-detail-label">Visibilidad</span>
                  <span className="rv-detail-value">{resource.visibility === 'PUBLIC' ? 'Público' : resource.visibility === 'PRIVATE' ? 'Privado' : 'Borrador'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceViewPage;
