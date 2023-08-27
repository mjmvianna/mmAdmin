import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Comentar <React.StrictMode> antes de rodar o build para produção
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
);
