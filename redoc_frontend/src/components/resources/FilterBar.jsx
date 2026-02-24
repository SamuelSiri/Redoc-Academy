import { useState, useEffect } from 'react';
import useCategoryStore from '../../store/categoryStore';
import SearchBar from '../common/SearchBar';
import { FILE_TYPE_LABELS } from '../../utils/constants';

const FilterBar = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    search: '',
    fileType: '',
    categoryId: '',
    subcategoryId: '',
  });

  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (key, value) => {
    const updated = { ...filters, [key]: value };

    // Reset subcategoría si cambia la categoría
    if (key === 'categoryId') {
      updated.subcategoryId = '';
    }

    setFilters(updated);
    onFilter(updated);
  };

  const selectedCategory = categories.find(
    (c) => c.id === parseInt(filters.categoryId)
  );

  return (
    <div className="filter-bar">
      <SearchBar
        onSearch={(query) => handleChange('search', query)}
        placeholder="Buscar por título..."
      />

      <div className="filter-selects">
        <select
          value={filters.fileType}
          onChange={(e) => handleChange('fileType', e.target.value)}
        >
          <option value="">Todos los tipos</option>
          {Object.entries(FILE_TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        <select
          value={filters.categoryId}
          onChange={(e) => handleChange('categoryId', e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {selectedCategory?.subcategories?.length > 0 && (
          <select
            value={filters.subcategoryId}
            onChange={(e) => handleChange('subcategoryId', e.target.value)}
          >
            <option value="">Todas las subcategorías</option>
            {selectedCategory.subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default FilterBar;