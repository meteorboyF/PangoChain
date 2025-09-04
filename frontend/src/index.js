import React from 'react';
import ReactDOM from 'react-dom/client';

// This line IMPORTS the CSS file. The CSS code itself stays in index.css
import './index.css'; 

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);