import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@xyflow/react/dist/style.css';
import '@/styles/global.scss';
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the grid
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional Theme applied to the grid

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
