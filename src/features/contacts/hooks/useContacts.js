import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsService } from '../services/contacts';

export function useContactsList({ page = 1, limit = 10, search = '', status = '' }) {
  return useQuery({
    queryKey: ['contacts', { page, limit, search, status }],
    queryFn: () => contactsService.getContacts({ page, limit, search, status }),
    keepPreviousData: true, // Evita parpadeos de carga al paginar
    staleTime: 30 * 1000, // 30 segundos de datos válidos
  });
}

export function useContactMutations() {
  const queryClient = useQueryClient();

  // 1. Mutación para Crear
  const createMutation = useMutation({
    mutationFn: (payload) => contactsService.createContact(payload),
    onSuccess: () => {
      // Invalidar todas las consultas que contengan la clave 'contacts' para forzar refresco
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['totalCustomersCount'] });
    }
  });

  // 2. Mutación para Editar
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => contactsService.updateContact(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    }
  });

  // 3. Mutación para Eliminar (Soft Delete)
  const deleteMutation = useMutation({
    mutationFn: (id) => contactsService.deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['totalCustomersCount'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardTotalCustomers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardOverdueCustomers'] });
    }
  });

  return {
    createContact: createMutation.mutateAsync,
    isCreating: createMutation.isLoading,
    createError: createMutation.error,

    updateContact: updateMutation.mutateAsync,
    isUpdating: updateMutation.isLoading,
    updateError: updateMutation.error,

    deleteContact: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isLoading,
    deleteError: deleteMutation.error,
  };
}
