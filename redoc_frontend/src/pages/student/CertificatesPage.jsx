import { useState, useEffect } from 'react';
import { certificateService } from '../../services/certificateService';
import './Certificates.css';

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await certificateService.getMyCertificates();
        setCertificates(data.data?.certificates || data.data || []);
      } catch { /* ignore */ }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="cert">
      <h1>Mis certificados</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : certificates.length === 0 ? (
        <div className="cert-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
          <p>Aún no tienes certificados. Completa un curso al 100% para obtener uno.</p>
        </div>
      ) : (
        <div className="cert-list">
          {certificates.map((cert) => (
            <div key={cert.id} className="cert-card">
              <div className="cert-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
              </div>
              <div className="cert-info">
                <h3>{cert.course?.title || 'Curso'}</h3>
                <p className="cert-code">Código: {cert.uniqueCode}</p>
                <p className="cert-date">Emitido: {new Date(cert.issuedAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
