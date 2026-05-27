import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Crear cliente de TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita llamadas excesivas al cambiar de pestaña
      retry: false, // Desactivar reintentos agresivos para facilitar depuración
      staleTime: 5 * 60 * 1000, // 5 minutos de validez de datos en caché
      cacheTime: 10 * 60 * 1000, // 10 minutos en memoria
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
