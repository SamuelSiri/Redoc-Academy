import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCategoryStore from '../../store/categoryStore';
import useResourceStore from '../../store/resourceStore';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import { FaCloudUploadAlt } from 'react-icons/fa';

const UploadForm = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    subcategoryId: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { categories, fetchCategories } = useCategoryStore();
  const { uploadResource } = useResourceStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Selecciona un archivo');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('subcategoryId', form.subcategoryId);

    try {
      await uploadResource(formData);
      toast.success('Recurso subido exitosamente!');
      navigate('/teacher/my-uploads');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al subir recurso');
    } finally {
      setLoading(false);
    }
  };

  // Flatten subcategorías para el select
  const subcategoryOptions = categories.flatMap((cat) =>
    (cat.subcategories || []).map((sub) => ({
      id: sub.id,
      label: `${cat.name} → ${sub.name}`,
    }))
  );

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div className="form-group">
        <label htmlFor="title">Título</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Nombre del recurso"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción (opcional)</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Breve descripción del recurso"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="subcategoryId">Subcategoría</label>
        <select
          id="subcategoryId"
          name="subcategoryId"
          value={form.subcategoryId}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona una subcategoría</option>
          {subcategoryOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Archivo</label>
        <div className="file-input-wrapper">
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="file-input"
          />
          <label htmlFor="file" className="file-input-label">
            <FaCloudUploadAlt size={24} />
            {file ? file.name : 'Seleccionar archivo'}
          </label>
        </div>
      </div>

      <Button type="submit" loading={loading} className="btn-block">
        Subir Recurso
      </Button>
    </form>
  );
};

export default UploadForm;