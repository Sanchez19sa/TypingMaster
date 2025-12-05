import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n/config';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<div style={{ color: '#fff', textAlign: 'center', marginTop: '20%' }}>Loading...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>,
);

