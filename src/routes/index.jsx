import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Login } from '../features/auth/Login';
import { Dashboard } from '../features/dashboard/Dashboard';
import { ContactsPage } from '../features/contacts/pages/ContactsPage';
import { DashboardLayout } from '../layouts/DashboardLayout';

export function AppRoutes() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<Login />} />

      {/* Rutas Protegidas (Requieren sesión activa en Supabase) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contacts" element={<ContactsPage />} />
          
          {/* Redirección del Home al panel por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>

      {/* Capturar cualquier ruta inexistente y redirigir al panel */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
