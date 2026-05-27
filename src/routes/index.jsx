import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Login } from '../features/auth/Login';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { RefreshCw } from 'lucide-react';

// Lazy imports for feature pages to reduce initial bundle size and optimize performance
const Dashboard = lazy(() => import('../features/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const ContactsPage = lazy(() => import('../features/contacts/pages/ContactsPage').then(m => ({ default: m.ContactsPage })));

/**
 * LoadingFallback — A premium animated loading spinner for suspense state
 */
function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-3 text-slate-500 dark:text-slate-400">
      <RefreshCw className="w-8 h-8 animate-spin text-indigo-500 dark:text-indigo-400" />
      <p className="text-xs font-semibold uppercase tracking-wider">Cargando sección...</p>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<Login />} />

      {/* Rutas Protegidas (Requieren sesión activa en Supabase) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route 
            path="/dashboard" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Dashboard />
              </Suspense>
            } 
          />
          <Route 
            path="/contacts" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ContactsPage />
              </Suspense>
            } 
          />
          
          {/* Redirección del Home al panel por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* Capturar cualquier ruta inexistente y redirigir al panel */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
