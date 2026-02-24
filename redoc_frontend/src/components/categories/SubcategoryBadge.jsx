import { FaTimes } from 'react-icons/fa';

const SubcategoryBadge = ({ subcategory, onDelete }) => {
  return (
    <span className="subcategory-badge">
      {subcategory.name}
      {onDelete && (
        <button onClick={onDelete} className="badge-delete">
          <FaTimes size={10} />
        </button>
      )}
    </span>
  );
};

export default SubcategoryBadge;