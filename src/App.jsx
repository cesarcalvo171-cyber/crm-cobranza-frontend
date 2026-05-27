import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { AppRoutes } from './routes';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

/**
 * App — Componente raíz de la aplicación.
 *
 * Jerarquía de renderización:
 *   ErrorBoundary       ← Captura crashes antes de que lleguen al DOM
 *     BrowserRouter     ← Contexto de routing
 *       AppProviders    ← Theme, QueryClient, Auth
 *         AppRoutes     ← Mapa de rutas React Router
 */
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProviders>
          <AppRoutes />
        </AppProviders>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
