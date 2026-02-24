import Button from '../common/Button';
import { FILE_TYPE_LABELS } from '../../utils/constants';
import { resourceService } from '../../services/resourceService';
import { FaDownload, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ResourceDetail = ({ resource }) => {
  const navigate = useNavigate();

  const handleDownload = () => {
    const url = resourceService.getDownloadUrl(resource.id);
    window.open(url, '_blank');
  };

  return (
    <div className="resource-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Volver
      </button>

      <div className="resource-detail-header">
        <FileIcon fileType={resource.fileType} size={48} />
        <div>
          <h1>{resource.title}</h1>
          <span className="resource-detail-type">
            {FILE_TYPE_LABELS[resource.fileType]}
          </span>
        </div>
      </div>

      {resource.description && (
        <p className="resource-detail-desc">{resource.description}</p>
      )}

      <div className="resource-detail-info">
        <div className="detail-row">
          <span>Categoría</span>
          <span>{resource.subcategory?.category?.name} → {resource.subcategory?.name}</span>
        </div>
        <div className="detail-row">
          <span>Subido por</span>
          <span>{resource.teacher?.name}</span>
        </div>
        <div className="detail-row">
          <span>Tamaño</span>
          <span>{formatFileSize(resource.fileSize)}</span>
        </div>
        <div className="detail-row">
          <span>Archivo original</span>
          <span>{resource.originalName}</span>
        </div>
        <div className="detail-row">
          <span>Descargas</span>
          <span>{resource.downloadCount}</span>
        </div>
        <div className="detail-row">
          <span>Fecha</span>
          <span>{formatDateTime(resource.createdAt)}</span>
        </div>
      </div>

      <Button variant="primary" onClick={handleDownload} className="download-btn">
        <FaDownload /> Descargar
      </Button>
    </div>
  );
};

export default ResourceDetail;