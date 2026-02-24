import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCategoryStore from '../../store/categoryStore';
import useResourceStore from '../../store/resourceStore';
import './UploadPage.css';

const TYPE_OPTIONS = [
  { id: 'PDF', label: 'PDF', color: '#dc2626', bg: '#fef2f2', accept: '.pdf', desc: 'Documentos PDF' },
  { id: 'VIDEO', label: 'Video', color: '#7c3aed', bg: '#f5f3ff', accept: '.mp4,.mov,.avi,.mkv', desc: 'Videos y tutoriales' },
  { id: 'IMAGE', label: 'Imagen', color: '#059669', bg: '#ecfdf5', accept: '.png,.jpg,.jpeg,.gif,.svg,.webp', desc: 'Fotos e infografías' },
  { id: 'DOCUMENT', label: 'Documento', color: '#2563eb', bg: '#eff6ff', accept: '.doc,.docx,.pptx,.xlsx,.odt', desc: 'Word, Excel, PPT' },
  { id: 'CODE', label: 'Código', color: '#ea580c', bg: '#fff7ed', accept: '.js,.py,.java,.html,.css,.ts,.json,.sql', desc: 'Snippets y scripts' },
  { id: 'LINK', label: 'Enlace', color: '#0891b2', bg: '#ecfeff', accept: '', desc: 'URLs y referencias' },
  { id: 'QR', label: 'Código QR', color: '#4f46e5', bg: '#eef2ff', accept: '.png,.jpg,.svg', desc: 'Accesos rápidos' },
  { id: 'TEXT', label: 'Texto', color: '#64748b', bg: '#f8fafc', accept: '.txt,.md,.csv,.log', desc: 'Notas y archivos de texto' },
  { id: 'AUDIO', label: 'Audio', color: '#db2777', bg: '#fdf2f8', accept: '.mp3,.wav,.ogg,.m4a', desc: 'Podcasts y grabaciones' },
  { id: 'COMPRESSED', label: 'Comprimido', color: '#854d0e', bg: '#fefce8', accept: '.zip,.rar,.7z,.tar.gz', desc: 'Archivos comprimidos' },
];

const VISIBILITY_OPTIONS = [
  { id: 'PUBLIC', label: 'Público', desc: 'Visible para todos los estudiantes', color: '#059669', icon: 'globe' },
  { id: 'PRIVATE', label: 'Solo mis grupos', desc: 'Solo estudiantes de tus grupos', color: '#d97706', icon: 'lock' },
  { id: 'DRAFT', label: 'Borrador', desc: 'No visible, solo tú puedes verlo', color: '#6b7280', icon: 'draft' },
];

const DIFFICULTY_OPTIONS = [
  { id: 'BASIC', label: 'Básico', color: '#059669' },
  { id: 'INTERMEDIATE', label: 'Intermedio', color: '#d97706' },
  { id: 'ADVANCED', label: 'Avanzado', color: '#dc2626' },
];

const TypeIcon = ({ type, size = 32 }) => {
  const s = size;
  const icons = {
    PDF: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15v-2h2a1 1 0 1 1 0 2H9z"/></svg>,
    VIDEO: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    IMAGE: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    DOCUMENT: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    CODE: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    LINK: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    QR: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/></svg>,
    TEXT: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="12" y1="17" x2="8" y2="17"/></svg>,
    AUDIO: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
    COMPRESSED: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>,
  };
  return icons[type] || icons.DOCUMENT;
};

const VisIcon = ({ type, size = 20 }) => {
  const s = size;
  const icons = {
    globe: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    lock: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    draft: <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  };
  return icons[type] || icons.globe;
};

const formatSize = (bytes) => {
  if (!bytes) return '';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const UploadPage = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const { categories: apiCategories, fetchCategories } = useCategoryStore();
  const uploadResource = useResourceStore((s) => s.uploadResource);

  useEffect(() => {
    fetchCategories();
  }, []);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [type, setType] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [visibility, setVisibility] = useState('PUBLIC');
  const [difficulty, setDifficulty] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const selectedCat = apiCategories.find(c => c.id === Number(category));
  const selectedType = TYPE_OPTIONS.find(t => t.id === type);
  const isLink = type === 'LINK';

  const handleFile = (f) => {
    if (f) {
      setFile(f);
      if (!title) setTitle(f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 8) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  const handleTagKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addTag(); }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (t) => setTags(tags.filter(x => x !== t));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type) return toast.error('Selecciona un tipo de recurso');
    if (!category) return toast.error('Selecciona una categoría');
    if (!isLink && !file) return toast.error('Selecciona un archivo');
    if (isLink && !linkUrl) return toast.error('Ingresa la URL del enlace');

    setUploading(true);
    try {
      const formData = new FormData();
      if (isLink) {
        formData.append('linkUrl', linkUrl);
      } else {
        formData.append('file', file);
      }
      formData.append('title', title);
      if (desc) formData.append('description', desc);
      formData.append('categoryId', category);
      if (subcategory) formData.append('subcategoryId', subcategory);
      formData.append('fileType', type);
      formData.append('visibility', visibility);
      if (difficulty) formData.append('difficulty', difficulty);
      if (tags.length > 0) formData.append('tags', JSON.stringify(tags));

      await uploadResource(formData);
      toast.success('¡Recurso subido exitosamente!');
      navigate('/teacher/my-uploads');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al subir el recurso');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  // Derive display names from the selected IDs for the preview
  const selectedCatName = selectedCat?.name || '';
  const selectedSubName = selectedCat?.subcategories?.find(s => s.id === Number(subcategory))?.name || '';

  return (
    <div className="up">
      {/* Header */}
      <div className="up-head">
        <div className="up-head-left">
          <div className="up-head-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <div>
            <h1>Subir recurso</h1>
            <p>Comparte material educativo con tus estudiantes</p>
          </div>
        </div>
        <div className="up-head-steps">
          <div className={`up-step ${type ? 'up-step--done' : 'up-step--active'}`}>1. Tipo</div>
          <div className={`up-step ${type && (title || file) ? 'up-step--done' : type ? 'up-step--active' : ''}`}>2. Detalles</div>
          <div className={`up-step ${type && title && (file || (isLink && linkUrl)) ? 'up-step--active' : ''}`}>3. Subir</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ===== TYPE SELECTOR ===== */}
        <div className="up-section">
          <h2 className="up-section-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5624d0" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            ¿Qué tipo de recurso vas a subir?
          </h2>
          <div className="up-types">
            {TYPE_OPTIONS.map(t => (
              <button
                key={t.id}
                type="button"
                className={`up-type-card ${type === t.id ? 'up-type-card--active' : ''}`}
                onClick={() => { setType(t.id); setFile(null); setLinkUrl(''); }}
                style={type === t.id ? { background: t.color, borderColor: t.color } : {}}
              >
                <div className="up-type-card-icon" style={type === t.id ? { background: 'rgba(255,255,255,0.2)', color: '#fff' } : { background: t.bg, color: t.color }}>
                  <TypeIcon type={t.id} size={28} />
                </div>
                <span className="up-type-card-label" style={type === t.id ? { color: '#fff' } : {}}>{t.label}</span>
                <span className="up-type-card-desc" style={type === t.id ? { color: 'rgba(255,255,255,0.75)' } : {}}>{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {type && (
          <>
            {/* ===== MAIN CONTENT ===== */}
            <div className="up-main">
              {/* Left col - form fields */}
              <div className="up-main-left">
                <div className="up-section">
                  <h2 className="up-section-title">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Información del recurso
                  </h2>

                  <div className="up-field">
                    <label className="up-label">Título <span>*</span></label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej: Introducción a JavaScript ES6+" required />
                  </div>

                  <div className="up-field">
                    <label className="up-label">Descripción</label>
                    <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe brevemente el contenido del recurso, para qué sirve y a quién va dirigido..." rows={4} />
                    <span className="up-char-count">{desc.length}/500</span>
                  </div>

                  <div className="up-field-row">
                    <div className="up-field up-field--half">
                      <label className="up-label">Categoría <span>*</span></label>
                      <select value={category} onChange={e => { setCategory(e.target.value); setSubcategory(''); }} required>
                        <option value="">Seleccionar...</option>
                        {apiCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="up-field up-field--half">
                      <label className="up-label">Subcategoría</label>
                      <select value={subcategory} onChange={e => setSubcategory(e.target.value)} disabled={!selectedCat}>
                        <option value="">Seleccionar...</option>
                        {selectedCat?.subcategories?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="up-field-row">
                    <div className="up-field up-field--half">
                      <label className="up-label">Dificultad</label>
                      <div className="up-diff-btns">
                        {DIFFICULTY_OPTIONS.map(d => (
                          <button
                            key={d.id}
                            type="button"
                            className={`up-diff-btn ${difficulty === d.id ? 'up-diff-btn--active' : ''}`}
                            onClick={() => setDifficulty(difficulty === d.id ? '' : d.id)}
                            style={difficulty === d.id ? { background: d.color, borderColor: d.color, color: '#fff' } : {}}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="up-field up-field--half">
                      <label className="up-label">Etiquetas <span className="up-label-hint">({tags.length}/8)</span></label>
                      <div className="up-tags-input">
                        {tags.map(t => (
                          <span key={t} className="up-tag">
                            {t}
                            <button type="button" onClick={() => removeTag(t)}>×</button>
                          </span>
                        ))}
                        <input
                          type="text"
                          value={tagInput}
                          onChange={e => setTagInput(e.target.value)}
                          onKeyDown={handleTagKey}
                          placeholder={tags.length < 8 ? 'Escribe y presiona Enter...' : ''}
                          disabled={tags.length >= 8}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visibility */}
                <div className="up-section">
                  <h2 className="up-section-title">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Visibilidad
                  </h2>
                  <div className="up-vis-options">
                    {VISIBILITY_OPTIONS.map(v => (
                      <button
                        key={v.id}
                        type="button"
                        className={`up-vis-card ${visibility === v.id ? 'up-vis-card--active' : ''}`}
                        onClick={() => setVisibility(v.id)}
                        style={visibility === v.id ? { borderColor: v.color, background: `${v.color}08` } : {}}
                      >
                        <div className="up-vis-icon" style={{ color: v.color, background: `${v.color}15` }}>
                          <VisIcon type={v.icon} size={22} />
                        </div>
                        <div className="up-vis-text">
                          <strong style={visibility === v.id ? { color: v.color } : {}}>{v.label}</strong>
                          <span>{v.desc}</span>
                        </div>
                        <div className={`up-vis-radio ${visibility === v.id ? 'up-vis-radio--on' : ''}`} style={visibility === v.id ? { borderColor: v.color, background: v.color } : {}} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right col - file upload + preview */}
              <div className="up-main-right">
                {/* File / Link */}
                <div className="up-section">
                  <h2 className="up-section-title">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={selectedType?.color || '#6a6f73'} strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {isLink ? 'Enlace del recurso' : 'Archivo'}
                  </h2>

                  {isLink ? (
                    <div className="up-field">
                      <input type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://ejemplo.com/recurso" required />
                      <p className="up-hint">Pega el enlace completo incluyendo https://</p>
                    </div>
                  ) : !file ? (
                    <div
                      className={`up-drop ${dragging ? 'up-drop--active' : ''}`}
                      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                      style={dragging && selectedType ? { borderColor: selectedType.color, background: selectedType.bg } : {}}
                    >
                      <input ref={fileRef} type="file" accept={selectedType?.accept || '*'} onChange={e => handleFile(e.target.files[0])} hidden />
                      <div className="up-drop-icon-wrap" style={{ background: selectedType?.bg, color: selectedType?.color }}>
                        <TypeIcon type={type} size={44} />
                      </div>
                      <p className="up-drop-text"><strong>Click para seleccionar</strong> o arrastra aquí</p>
                      <p className="up-drop-hint">Formatos: {selectedType?.accept || 'cualquier tipo'}</p>
                      <p className="up-drop-hint">Tamaño máximo: 50 MB</p>
                    </div>
                  ) : (
                    <div className="up-file-card">
                      <div className="up-file-icon" style={{ background: selectedType?.color }}>
                        <TypeIcon type={type} size={26} />
                      </div>
                      <div className="up-file-info">
                        <span className="up-file-name">{file.name}</span>
                        <span className="up-file-size">{formatSize(file.size)} · {file.type || 'archivo'}</span>
                      </div>
                      <button type="button" className="up-file-change" onClick={() => fileRef.current?.click()}>Cambiar</button>
                      <button type="button" className="up-file-remove" onClick={removeFile}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                      <input ref={fileRef} type="file" accept={selectedType?.accept || '*'} onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); }} hidden />
                    </div>
                  )}
                </div>

                {/* Live preview */}
                <div className="up-section">
                  <h2 className="up-section-title">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Vista previa
                  </h2>
                  <div className="up-live-card">
                    <div className="up-live-top" style={{ background: selectedType?.bg || '#f3f4f6' }}>
                      <div style={{ color: selectedType?.color || '#9ca3af', opacity: file || (isLink && linkUrl) ? 1 : 0.35 }}>
                        <TypeIcon type={type} size={52} />
                      </div>
                      {type && <span className="up-live-badge" style={{ background: selectedType?.color }}>{type}</span>}
                    </div>
                    <div className="up-live-body">
                      <h4>{title || 'Título del recurso'}</h4>
                      <p>{desc || 'La descripción del recurso aparecerá aquí...'}</p>
                      <div className="up-live-meta">
                        {selectedCatName && <span className="up-live-cat">{selectedCatName}</span>}
                        {selectedSubName && <><span className="up-live-dot">·</span><span>{selectedSubName}</span></>}
                        {(file || isLink) && <><span className="up-live-dot">·</span><span>{isLink ? 'Enlace' : formatSize(file?.size)}</span></>}
                      </div>
                      {tags.length > 0 && (
                        <div className="up-live-tags">
                          {tags.map(t => <span key={t} className="up-live-tag">{t}</span>)}
                        </div>
                      )}
                      <div className="up-live-footer">
                        {difficulty && (
                          <span className="up-live-diff" style={{ color: DIFFICULTY_OPTIONS.find(d => d.id === difficulty)?.color }}>
                            {DIFFICULTY_OPTIONS.find(d => d.id === difficulty)?.label}
                          </span>
                        )}
                        <span className="up-live-vis" style={{ color: VISIBILITY_OPTIONS.find(v => v.id === visibility)?.color }}>
                          {VISIBILITY_OPTIONS.find(v => v.id === visibility)?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="up-actions">
              <button type="button" className="up-cancel" onClick={() => navigate(-1)}>Cancelar</button>
              <button type="button" className="up-draft" onClick={() => { setVisibility('DRAFT'); toast.success('Guardado como borrador'); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
                Guardar borrador
              </button>
              <button type="submit" className="up-submit" disabled={uploading}>
                {uploading ? (
                  <><span className="up-spinner" /> Subiendo...</>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Subir recurso
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default UploadPage;
