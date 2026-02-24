import { useState } from 'react';
import { FaTrash, FaPlus } from 'react-icons/fa';
import useCategoryStore from '../../store/categoryStore';
import SubcategoryBadge from './SubcategoryBadge';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const CategoryList = ({ categories }) => {
  const [newSubName, setNewSubName] = useState({});
  const { addSubcategory, deleteCategory, deleteSubcategory } = useCategoryStore();

  const handleAddSub = async (categoryId) => {
    const name = newSubName[categoryId];
    if (!name?.trim()) return;

    try {
      await addSubcategory(categoryId, { name: name.trim() });
      setNewSubName({ ...newSubName, [categoryId]: '' });
      toast.success('Subcategoría creada');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('¿Eliminar esta categoría y todas sus subcategorías?')) return;
    try {
      await deleteCategory(id);
      toast.success('Categoría eliminada');
    } catch (err) {
      toast.error('Error eliminando categoría');
    }
  };

  const handleDeleteSub = async (categoryId, subId) => {
    if (!confirm('¿Eliminar esta subcategoría?')) return;
    try {
      await deleteSubcategory(categoryId, subId);
      toast.success('Subcategoría eliminada');
    } catch (err) {
      toast.error('Error eliminando subcategoría');
    }
  };

  return (
    <div className="category-list">
      {categories.map((cat) => (
        <div key={cat.id} className="category-item">
          <div className="category-header">
            <h3>{cat.name}</h3>
            <button
              className="icon-btn danger"
              onClick={() => handleDeleteCategory(cat.id)}
              title="Eliminar categoría"
            >
              <FaTrash />
            </button>
          </div>

          {cat.description && <p className="category-desc">{cat.description}</p>}

          <div className="subcategory-list">
            {(cat.subcategories || []).map((sub) => (
              <SubcategoryBadge
                key={sub.id}
                subcategory={sub}
                onDelete={() => handleDeleteSub(cat.id, sub.id)}
              />
            ))}
          </div>

          <div className="add-sub-row">
            <input
              type="text"
              placeholder="Nueva subcategoría..."
              value={newSubName[cat.id] || ''}
              onChange={(e) =>
                setNewSubName({ ...newSubName, [cat.id]: e.target.value })
              }
              onKeyDown={(e) => e.key === 'Enter' && handleAddSub(cat.id)}
            />
            <Button
              size="sm"
              onClick={() => handleAddSub(cat.id)}
            >
              <FaPlus />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;