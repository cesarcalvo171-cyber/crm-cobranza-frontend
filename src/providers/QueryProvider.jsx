import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * QueryProvider — React Query v5 Hardened
 * ─────────────────────────────────────────────────────────────────────────────
 * Cambios v4B.5:
 *   - cacheTime → gcTime (React Query v5 renaming)
 *   - retry: 1 para queries (un reintento en errores de red transitorios)
 *   - retry: 0 para mutations (errores de escritura no deben reintentarse solos)
 *   - staleTime: 2 min (datos "frescos" por 2 minutos antes de refetch)
 *   - gcTime: 10 min (mantener en cache 10 min tras perder todos los observers)
 *   - refetchOnWindowFocus: false (evita requests al volver a la pestaña)
 *   - throwOnError: false (los errores los maneja cada hook individualmente)
 * ─────────────────────────────────────────────────────────────────────────────
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // No reintentar automáticamente en caso de error de autenticación/validación
      // pero sí 1 vez en errores de red transitorios
      retry: (failureCount, error) => {
        // No reintentar en errores de autenticación (4xx)
        const status = error?.response?.status;
        if (status === 401 || status === 403 || status === 404) return false;
        // Para errores de red o 5xx, 1 reintento
        return failureCount < 1;
      },
      // Datos considerados "frescos" durante 2 minutos → sin refetch automático
      staleTime: 2 * 60 * 1000,
      // Mantener datos en cache 10 minutos tras desmontarse el componente
      gcTime: 10 * 60 * 1000,
      // No refetch al volver a enfocar la ventana (evita requests inesperados)
      refetchOnWindowFocus: false,
      // Refetch automático al reconectar el dispositivo a internet
      refetchOnReconnect: true,
      // Los errores son manejados por cada hook — no propagarlos automáticamente
      throwOnError: false,
    },
    mutations: {
      // Las mutaciones no deben reintentarse solas — pueden causar duplicados
      retry: 0,
      // Los errores de mutación son manejados en cada useMutation individual
      throwOnError: false,
    },
  },
});

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Exportar queryClient para uso en casos especiales (ej: invalidar desde fuera de React)
export { queryClient };
