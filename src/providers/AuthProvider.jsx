import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { initTokenCache, clearTokenCache } from '../api/client';

/**
 * AuthProvider — v4C Estabilizado
 * ─────────────────────────────────────────────────────────────────────────────
 * Mejoras vs versión anterior:
 *   - Previene race condition sincronizando getSession con el Axios token cache
 *   - Await a initTokenCache() antes de setear loading: false
 *   - Limpia de forma segura el cache en logout
 * ─────────────────────────────────────────────────────────────────────────────
 */

const AuthContext = createContext({
  session: null,
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ref para evitar setState en componentes desmontados
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    // ── 1. Cargar sesión inicial sincronizada con Axios cache ───────────────
    const loadSession = async () => {
      try {
        // Garantizar que Axios token cache ha cargado el token primero
        await initTokenCache();
        
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!isMountedRef.current) return;
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (err) {
        console.error('[AUTH PROVIDER ERROR] Error cargando sesión inicial:', err);
      } finally {
        if (isMountedRef.current) {
          setLoading(false); // ← Cargado garantizado
        }
      }
    };

    loadSession();

    // ── 2. Suscribirse a cambios posteriores (login, logout, refresh) ─────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        if (!isMountedRef.current) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
    );

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  // No manipula `loading` — el estado de loading de Supabase es manejado por onAuthStateChange
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = async () => {
    // Limpiar cache de Axios antes de llamar a signOut
    clearTokenCache();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    session,
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/*
        CAMBIO CLAVE: Renderizamos children SIEMPRE (no condicionamos a !loading).
        ProtectedRoute es quien muestra el spinner durante loading.
        Esto evita que los providers hijos se desmonten/remonten en cada cambio de sesión.
      */}
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
