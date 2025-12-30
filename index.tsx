
import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Corrected import path for App to be a relative path './App' to resolve the module not found error.
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);