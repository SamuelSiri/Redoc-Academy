import ResourceCard from './ResourceCard';
import Loader from '../common/Loader';

const ResourceList = ({ resources, loading, emptyMessage = 'No se encontraron recursos' }) => {
  if (loading) return <Loader />;

  if (!resources?.length) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  return (
    <div className="resource-grid">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
};

export default ResourceList;