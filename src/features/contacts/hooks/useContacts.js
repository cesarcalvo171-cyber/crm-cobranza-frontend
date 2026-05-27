import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsService } from '../services/contacts';

/**
 * useContactsList
 * Hook para obtener la lista paginada de contactos con búsqueda y filtros.
 * Usa `keepPreviousData` para evitar parpadeos al paginar.
 */
export function useContactsList({ page = 1, limit = 10, search = '', status = '' }) {
  return useQuery({
    queryKey: ['contacts', { page, limit, search, status }],
    queryFn: ({ signal }) => contactsService.getContacts({ page, limit, search, status }, signal),
    placeholderData: (prev) => prev, // React Query v5: reemplaza keepPreviousData
    staleTime: 30 * 1000, // Override local: 30 segundos (más corto que el default de 2 min)
  });
}

/**
 * useContactMutations
 * Hook con las 3 mutaciones CRUD (Crear, Editar, Soft Delete).
 * Invalida el cache automáticamente tras cada operación exitosa.
 *
 * v4B.5 — Corregido: mutation.isLoading → mutation.isPending (React Query v5)
 */
export function useContactMutations() {
  const queryClient = useQueryClient();

  // ── 1. Crear Contacto ────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (payload) => contactsService.createContact(payload),
    onSuccess: () => {
      // Invalidar lista de contactos y métricas del dashboard
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });

  // ── 2. Editar Contacto ───────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => contactsService.updateContact(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  // ── 3. Soft Delete Contacto ──────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id) => contactsService.deleteContact(id),
    onSuccess: () => {
      // Invalidar lista de contactos y ambas claves del dashboard
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });

  return {
    createContact:  createMutation.mutateAsync,
    isCreating:     createMutation.isPending,   // ✅ v5: isPending (era isLoading)
    createError:    createMutation.error,

    updateContact:  updateMutation.mutateAsync,
    isUpdating:     updateMutation.isPending,   // ✅ v5: isPending (era isLoading)
    updateError:    updateMutation.error,

    deleteContact:  deleteMutation.mutateAsync,
    isDeleting:     deleteMutation.isPending,   // ✅ v5: isPending (era isLoading)
    deleteError:    deleteMutation.error,
  };
}
