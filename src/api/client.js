import axios from 'axios';
import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Crear instancia base de Axios
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Solicitud para inyección del JWT de Supabase
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Obtener la sesión activa de Supabase de manera asíncrona
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.access_token) {
        // Adjuntar token de autorización Bearer
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error('[API CLIENT INTERCEPTOR ERROR] Falló al inyectar JWT:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respuesta para control global de errores (ej. sesión expirada 401)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        console.warn('🔴 [API] Sesión no autorizada o JWT expirado. Forzando cierre de sesión.');
        // Opcional: supabase.auth.signOut();
      }
    }
    return Promise.reject(error);
  }
);
