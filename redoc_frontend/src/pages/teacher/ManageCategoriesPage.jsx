import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import useCategoryStore from '../../store/categoryStore';
import './ManageCategories.css';

const COLORS = ['#7c3aed', '#2563eb', '#059669', '#d97706', '#dc2626', '#db2777', '#0891b2', '#ea580c', '#4f46e5', '#854d0e', '#64748b', '#16a34a'];

const ICONS = [
  { id: 'code', label: 'Código', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
  { id: 'network', label: 'Red', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="6" height="6"/><path d="M12 2v7"/><path d="M12 15v7"/><path d="M2 12h7"/><path d="M15 12h7"/></svg> },
  { id: 'db', label: 'Base de Datos', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg> },
  { id: 'math', label: 'Matemáticas', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg> },
  { id: 'science', label: 'Ciencias', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 3h6v6l4 7H5l4-7V3z"/><line x1="8" y1="21" x2="16" y2="21"/></svg> },
  { id: 'language', label: 'Idioma', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg> },
  { id: 'design', label: 'Diseño', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="13.5" cy="6.5" r="2.5"/><path d="M17.5 10.5L22 2"/><path d="M2 22l10.5-10.5"/><circle cx="12" cy="12" r="2"/></svg> },
  { id: 'os', label: 'Sistemas', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
  { id: 'book', label: 'Lectura', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
  { id: 'folder', label: 'General', svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
];

const ManageCategoriesPage = () => {
  const { categories, loading, fetchCategories, addCategory, updateCategory, deleteCategory, addSubcategory, deleteSubcategory } = useCategoryStore();

  const [expanded, setExpanded] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [formName, setFormName] = useState('');
  const [formColor, setFormColor] = useState(COLORS[0]);
  const [formIcon, setFormIcon] = useState('folder');
  const [subInput, setSubInput] = useState('');
  const [editingSub, setEditingSub] = useState(null);
  const [editSubName, setEditSubName] = useState('');
  const [deleteCatId, setDeleteCatId] = useState(null);
  const [deleteSubId, setDeleteSubId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const totalSubs = categories.reduce((a, c) => a + (c.subcategories?.length || 0), 0);

  const openNew = () => {
    setEditingCat(null);
    setFormName('');
    setFormColor(COLORS[0]);
    setFormIcon('folder');
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setEditingCat(cat.id);
    setFormName(cat.name);
    setFormColor(cat.color || COLORS[0]);
    setFormIcon(cat.icon || 'folder');
    setShowForm(true);
  };

  const saveCategory = async () => {
    if (!formName.trim()) return toast.error('Escribe un nombre');
    setSaving(true);
    try {
      if (editingCat) {
        await updateCategory(editingCat, { name: formName.trim(), color: formColor, icon: formIcon });
        toast.success('Categoría actualizada');
      } else {
        await addCategory({ name: formName.trim(), color: formColor, icon: formIcon });
        toast.success('Categoría creada');
      }
      setShowForm(false);
      setEditingCat(null);
    } catch {
      toast.error('Error al guardar la categoría');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCat = async (id) => {
    try {
      await deleteCategory(id);
      setDeleteCatId(null);
      if (expanded === id) setExpanded(null);
      toast.success('Categoría eliminada');
    } catch {
      toast.error('Error al eliminar la categoría');
    }
  };

  const addSub = async (catId) => {
    if (!subInput.trim()) return;
    try {
      await addSubcategory(catId, { name: subInput.trim() });
      setSubInput('');
      toast.success('Subcategoría agregada');
    } catch {
      toast.error('Error al agregar subcategoría');
    }
  };

  const handleDeleteSub = async (catId, subId) => {
    try {
      await deleteSubcategory(catId, subId);
      setDeleteSubId(null);
      toast.success('Subcategoría eliminada');
    } catch {
      toast.error('Error al eliminar subcategoría');
    }
  };

  const getIcon = (iconId) => ICONS.find(i => i.id === iconId)?.svg || ICONS[ICONS.length - 1].svg;

  if (loading && categories.length === 0) {
    return (
      <div className="mc">
        <div className="mc-head">
          <div className="mc-head-left">
            <div className="mc-head-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div>
              <h1>Categorías</h1>
              <p>Organiza el contenido educativo</p>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6a6f73' }}>
          <p style={{ fontSize: '16px' }}>Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mc">
      {/* Header */}
      <div className="mc-head">
        <div className="mc-head-left">
          <div className="mc-head-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div>
            <h1>Categorías</h1>
            <p>Organiza el contenido educativo</p>
          </div>
        </div>
        <button className="mc-add-btn" onClick={openNew}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva categoría
        </button>
      </div>

      {/* Stats */}
      <div className="mc-stats">
        <div className="mc-stat mc-stat--purple">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          <div><strong>{categories.length}</strong><span>Categorías</span></div>
        </div>
        <div className="mc-stat mc-stat--blue">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          <div><strong>{totalSubs}</strong><span>Subcategorías</span></div>
        </div>
        <div className="mc-stat mc-stat--emerald">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <div><strong>{categories.length * 4}</strong><span>Recursos totales</span></div>
        </div>
      </div>

      {/* ===== MODAL FORM ===== */}
      {showForm && (
        <div className="mc-overlay" onClick={() => setShowForm(false)}>
          <div className="mc-modal" onClick={e => e.stopPropagation()}>
            <div className="mc-modal-head">
              <h2>{editingCat ? 'Editar categoría' : 'Nueva categoría'}</h2>
              <button className="mc-modal-close" onClick={() => setShowForm(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="mc-modal-body">
              {/* Preview */}
              <div className="mc-modal-preview" style={{ background: formColor }}>
                <div className="mc-modal-preview-icon">{getIcon(formIcon)}</div>
                <span>{formName || 'Nombre de la categoría'}</span>
              </div>

              <div className="mc-modal-field">
                <label>Nombre</label>
                <input type="text" value={formName} onChange={e => setFormName(e.target.value)} placeholder="Ej: Inteligencia Artificial" autoFocus />
              </div>

              <div className="mc-modal-field">
                <label>Color</label>
                <div className="mc-color-grid">
                  {COLORS.map(c => (
                    <button key={c} type="button" className={`mc-color-dot ${formColor === c ? 'mc-color-dot--active' : ''}`} style={{ background: c }} onClick={() => setFormColor(c)}>
                      {formColor === c && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mc-modal-field">
                <label>Icono</label>
                <div className="mc-icon-grid">
                  {ICONS.map(i => (
                    <button key={i.id} type="button" className={`mc-icon-btn ${formIcon === i.id ? 'mc-icon-btn--active' : ''}`} onClick={() => setFormIcon(i.id)} style={formIcon === i.id ? { background: formColor, color: '#fff', borderColor: formColor } : {}}>
                      {i.svg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mc-modal-foot">
              <button className="mc-modal-cancel" onClick={() => setShowForm(false)}>Cancelar</button>
              <button className="mc-modal-save" onClick={saveCategory} disabled={saving} style={{ background: formColor }}>{saving ? 'Guardando...' : editingCat ? 'Guardar cambios' : 'Crear categoría'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== CATEGORY CARDS ===== */}
      <div className="mc-grid">
        {categories.map(cat => {
          const subs = cat.subcategories || [];
          const isOpen = expanded === cat.id;
          return (
            <div key={cat.id} className={`mc-card ${isOpen ? 'mc-card--open' : ''}`}>
              {/* Card header */}
              <div className="mc-card-head" onClick={() => setExpanded(isOpen ? null : cat.id)}>
                <div className="mc-card-icon" style={{ background: cat.color || COLORS[0] }}>
                  {getIcon(cat.icon)}
                </div>
                <div className="mc-card-info">
                  <h3>{cat.name}</h3>
                  <span>{subs.length} subcategorías</span>
                </div>
                <div className="mc-card-actions" onClick={e => e.stopPropagation()}>
                  <button className="mc-card-act mc-card-act--edit" onClick={() => openEdit(cat)} title="Editar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  {deleteCatId === cat.id ? (
                    <div className="mc-del-confirm">
                      <button className="mc-del-yes" onClick={() => handleDeleteCat(cat.id)}>Sí</button>
                      <button className="mc-del-no" onClick={() => setDeleteCatId(null)}>No</button>
                    </div>
                  ) : (
                    <button className="mc-card-act mc-card-act--del" onClick={() => setDeleteCatId(cat.id)} title="Eliminar">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  )}
                </div>
                <svg className={`mc-card-chevron ${isOpen ? 'mc-card-chevron--open' : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>

              {/* Subcategories */}
              {isOpen && (
                <div className="mc-card-body">
                  <div className="mc-subs">
                    {subs.map(sub => (
                      <div key={sub.id} className="mc-sub">
                        {editingSub === sub.id ? (
                          <div className="mc-sub-edit">
                            <input type="text" value={editSubName} onChange={e => setEditSubName(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveEditSub(cat.id, sub.id)} autoFocus />
                            <button className="mc-sub-save" onClick={() => saveEditSub(cat.id, sub.id)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            </button>
                            <button className="mc-sub-cancel-edit" onClick={() => setEditingSub(null)}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="mc-sub-dot" style={{ background: cat.color || COLORS[0] }} />
                            <span className="mc-sub-name">{sub.name}</span>
                            <div className="mc-sub-actions">
                              <button className="mc-sub-act" onClick={() => { setEditingSub(sub.id); setEditSubName(sub.name); }} title="Editar">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              </button>
                              {deleteSubId === sub.id ? (
                                <div className="mc-del-confirm mc-del-confirm--sm">
                                  <button className="mc-del-yes" onClick={() => handleDeleteSub(cat.id, sub.id)}>Sí</button>
                                  <button className="mc-del-no" onClick={() => setDeleteSubId(null)}>No</button>
                                </div>
                              ) : (
                                <button className="mc-sub-act mc-sub-act--del" onClick={() => setDeleteSubId(sub.id)} title="Eliminar">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add sub */}
                  <div className="mc-add-sub">
                    <input type="text" value={subInput} onChange={e => setSubInput(e.target.value)} placeholder="Nueva subcategoría..." onKeyDown={e => e.key === 'Enter' && addSub(cat.id)} />
                    <button onClick={() => addSub(cat.id)} style={{ background: cat.color || COLORS[0] }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageCategoriesPage;
