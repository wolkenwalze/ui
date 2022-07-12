import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// noinspection JSDeprecatedSymbols
const initialData = atob(document.location.hash.replace("#", ""))
root.render(
  <React.StrictMode>
    <App initialData={initialData} />
  </React.StrictMode>
);
