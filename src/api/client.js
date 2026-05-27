/**
 * api/client.js — Axios API Client Hardened
 * ─────────────────────────────────────────────────────────────────────────────
 * v4C — Token memory cache + auto-logout en 401 + síncronizado para inicialización
 *
 * Estrategia de token cache:
 *   - Un módulo-level `cachedToken` almacena el access_token en memoria.
 *   - Se sincroniza automáticamente via `supabase.auth.onAuthStateChange`.
 *   - El interceptor de request lee el cache SINCRÓNICAMENTE (sin await).
 *   - Esto elimina el overhead de llamar getSession() en cada request.
 *   - En 401: signOut automático + limpieza del cache + redirect a /login.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import axios from 'axios';
import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Token Memory Cache ────────────────────────────────────────────────────────
// Referencia en módulo: se mantiene durante toda la sesión del navegador.
// Se actualiza automáticamente con onAuthStateChange sin coste de red.
let cachedToken = null;
let isInitialized = false;
let initPromise = null;

/**
 * Inicializa el cache con la sesión existente y suscribe a cambios futuros.
 * Retorna una promesa para que el AuthProvider pueda sincronizar y garantizar
 * que el token esté cargado antes de desactivar el loading screen.
 */
export function initTokenCache() {
  if (isInitialized) return initPromise;
  isInitialized = true;

  initPromise = (async () => {
    try {
      // 1. Cargar sesión inicial (solo al arrancar la app)
      const { data: { session } } = await supabase.auth.getSession();
      cachedToken = session?.access_token ?? null;
    } catch (e) {
      console.error('[API] Error cargando sesión inicial en cache:', e);
    }

    // 2. Suscribirse a cambios: login, logout, token refresh automático
    supabase.auth.onAuthStateChange((_event, session) => {
      cachedToken = session?.access_token ?? null;
    });

    return cachedToken;
  })();

  return initPromise;
}

// Inicializar inmediatamente al importar el módulo para background loading
initTokenCache();

// ── Instancia Axios ───────────────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15s timeout para evitar requests colgados
});

// ── Interceptor de Request — Inyectar JWT desde cache ────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Lectura SÍNCRONA desde cache en memoria — sin overhead async
    if (cachedToken) {
      config.headers.Authorization = `Bearer ${cachedToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ── Interceptor de Response — Manejar errores globales ───────────────────────
apiClient.interceptors.response.use(
  // Respuestas exitosas pasan sin modificación
  (response) => response,

  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    // Detectar cancelaciones del AbortController para no tratarlas como errores de red ruidosos
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (status === 401) {
      // Prevenir loops: si ya se intentó re-autenticar, no reintentar
      if (originalRequest._retried) {
        return Promise.reject(error);
      }
      originalRequest._retried = true;

      console.warn('[API] Sesión expirada o inválida (401). Cerrando sesión automáticamente.');

      // Limpiar token del cache inmediatamente
      cachedToken = null;

      // Cerrar sesión en Supabase
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('[API] Error ejecutando signOut en 401:', e);
      }

      // Redirigir al login (sin depender de React Router para evitar imports circulares)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }

    // Loguear errores de servidor para debugging
    if (status >= 500) {
      console.error(`[API] Error de servidor ${status} en ${originalRequest?.url}:`, error.response?.data);
    }

    return Promise.reject(error);
  }
);

/**
 * Función para limpiar el cache manualmente (útil en logout explícito).
 * Se exporta para uso interno en AuthProvider si se necesita.
 */
export function clearTokenCache() {
  cachedToken = null;
}
