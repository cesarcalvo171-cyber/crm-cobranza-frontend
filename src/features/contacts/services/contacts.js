import { apiClient } from '../../../api/client';

export const contactsService = {
  /**
   * Obtiene la lista paginada de contactos con búsqueda y filtros
   */
  async getContacts({ page = 1, limit = 10, search = '', status = '' }) {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (search.trim()) params.append('search', search.trim());
    if (status) params.append('status', status);

    const { data } = await apiClient.get(`/api/contacts?${params.toString()}`);
    return data; // Retorna { success, data, pagination, schemaWarning }
  },

  /**
   * Obtiene un único contacto por su ID o Customer Number
   */
  async getContactById(id) {
    const { data } = await apiClient.get(`/api/contacts/${id}`);
    return data;
  },

  /**
   * Crea un contacto de forma manual
   */
  async createContact(payload) {
    const { data } = await apiClient.post('/api/contacts', payload);
    return data;
  },

  /**
   * Actualiza un contacto existente
   */
  async updateContact(id, payload) {
    const { data } = await apiClient.put(`/api/contacts/${id}`, payload);
    return data;
  },

  /**
   * Ejecuta la baja suave (Soft Delete) del contacto
   */
  async deleteContact(id) {
    const { data } = await apiClient.delete(`/api/contacts/${id}`);
    return data;
  },

  /**
   * Ejecuta la carga masiva CSV
   */
  async uploadCSV(rows) {
    const { data } = await apiClient.post('/api/contacts/upload-csv', { rows });
    return data;
  }
};
