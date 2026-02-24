import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/variables.css';  // agrega esta línea si no la tienes
import './styles/global.css';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);