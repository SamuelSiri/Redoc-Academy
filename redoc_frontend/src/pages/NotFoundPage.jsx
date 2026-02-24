import './NotFoundPage.css';
const NotFoundPage = () => (
  <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'80vh',gap:12}}>
    <span style={{fontSize:72,fontWeight:700,color:'#e5e7eb'}}>404</span>
    <p style={{fontSize:16,color:'#6a6f73'}}>Página no encontrada</p>
    <a href="/" style={{fontSize:14,fontWeight:700,color:'#5624d0'}}>Volver al inicio</a>
  </div>
);
export default NotFoundPage;
