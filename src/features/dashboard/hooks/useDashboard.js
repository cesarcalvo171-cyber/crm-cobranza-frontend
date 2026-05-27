import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard';

/**
 * useDashboardStats
 * Hook para obtener las métricas resumidas del dashboard.
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await dashboardService.getStats();
      if (!response.success) {
        throw new Error(response.error?.message || 'Error al obtener métricas');
      }
      return response.data;
    },
    // Mantener la data vieja mientras carga la nueva (React Query v5 placeholderData / staleTime)
    staleTime: 60 * 1000, // 1 minuto de staleTime para dashboard
  });
}
