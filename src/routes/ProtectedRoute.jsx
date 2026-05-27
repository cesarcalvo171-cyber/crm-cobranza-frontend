import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

export function ProtectedRoute() {
  const { session, loading } = useAuth();

  // Si está cargando el estado inicial, podemos mostrar una pantalla de carga premium
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium tracking-wide text-slate-400">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no hay sesión iniciada, redirige al login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza los hijos del router
  return <Outlet />;
}
