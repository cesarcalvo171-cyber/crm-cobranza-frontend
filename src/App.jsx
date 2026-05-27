import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { AppRoutes } from './routes';
import './App.css';

/**
 * Componente Principal de la Aplicación.
 * Inicializa BrowserRouter, carga todos los proveedores globales de contexto,
 * y activa el mapa central de enrutamiento modular.
 */
function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
