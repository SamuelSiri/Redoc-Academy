import { Link } from 'react-router-dom';
import { FILE_TYPE_LABELS } from '../../utils/constants';

const ResourceCard = ({ resource }) => {
  return (
    <Link to={`/resource/${resource.id}`} className="resource-card">
      <div className="resource-card-icon">
        <FileIcon fileType={resource.fileType} size={36} />
      </div>
      <div className="resource-card-info">
        <h3 className="resource-card-title">{resource.title}</h3>
        {resource.description && (
          <p className="resource-card-desc">{resource.description}</p>
        )}
        <div className="resource-card-meta">
          <span className="resource-card-type">{FILE_TYPE_LABELS[resource.fileType]}</span>
          <span className="resource-card-size">{formatFileSize(resource.fileSize)}</span>
          <span className="resource-card-date">{formatDate(resource.createdAt)}</span>
        </div>
        <div className="resource-card-bottom">
          <span className="resource-card-category">
            {resource.subcategory?.category?.name} → {resource.subcategory?.name}
          </span>
          <span className="resource-card-teacher">
            por {resource.teacher?.name}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ResourceCard;