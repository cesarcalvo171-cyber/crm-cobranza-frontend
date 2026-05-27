import { apiClient } from '../../../api/client';

export const dashboardService = {
  /**
   * Obtiene las métricas del dashboard desde el backend Express
   */
  async getStats() {
    const { data } = await apiClient.get('/api/dashboard/stats');
    return data; // Retorna { success: true, data: { totalCustomers, overdueCustomers, totalDebt, notificationsToday } }
  }
};
