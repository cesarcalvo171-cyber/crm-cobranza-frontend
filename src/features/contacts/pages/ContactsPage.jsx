import React, { useState } from 'react';
import { useContactsList, useContactMutations } from '../hooks/useContacts';
import { ContactsTable } from '../components/table/ContactsTable';
import { ContactsFilters } from '../components/filters/ContactsFilters';
import { ContactFormModal } from '../components/modals/ContactFormModal';
import { ConfirmDeleteDialog } from '../components/dialogs/ConfirmDeleteDialog';
import { ContactsSkeleton, ContactsEmpty, ContactsError } from '../components/states/ContactsStates';
import { Plus, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export function ContactsPage() {
  // Estados de Filtros y Paginación
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  // Estados de Modales y Diálogos
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deletingContact, setDeletingContact] = useState(null);

  // Estados de Toast locales para feedback premium de operaciones E2E
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // 1. Hook de Obtención de Listado de Contactos (React Query)
  const { data, isLoading, isError, error, refetch } = useContactsList({
    page,
    limit,
    search,
    status
  });

  // 2. Hook de Mutaciones (React Query useMutation)
  const { 
    createContact, 
    isCreating, 
    updateContact, 
    isUpdating, 
    deleteContact, 
    isDeleting 
  } = useContactMutations();

  // Handlers de Filtros (Reiniciar paginación al filtrar)
  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (val) => {
    setStatus(val);
    setPage(1);
  };

  // Handler de Envío de Formulario (Creación o Edición)
  const handleFormSubmit = async (values) => {
    try {
      if (editingContact) {
        // Ejecutar Edición
        await updateContact({ id: editingContact.id, payload: values });
        showToast('success', `Contacto "${values.name}" actualizado correctamente.`);
      } else {
        // Ejecutar Creación
        await createContact(values);
        showToast('success', `Contacto "${values.name}" creado con éxito.`);
      }
      setIsFormModalOpen(false);
      setEditingContact(null);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error?.message || 'Error al persistir el contacto.';
      showToast('error', errMsg);
      throw err;
    }
  };

  // Handler de Confirmación de Baja Suave (Soft Delete)
  const handleConfirmDelete = async (id) => {
    try {
      await deleteContact(id);
      showToast('success', 'El contacto ha sido dado de baja exitosamente (Soft Delete).');
      setDeletingContact(null);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error?.message || 'Error al procesar la baja.';
      showToast('error', errMsg);
    }
  };

  // Abrir Modal de Creación
  const handleCreateOpen = () => {
    setEditingContact(null);
    setIsFormModalOpen(true);
  };

  // Abrir Modal de Edición
  const handleEditOpen = (contact) => {
    setEditingContact(contact);
    setIsFormModalOpen(true);
  };

  // Abrir Diálogo de Eliminación
  const handleDeleteOpen = (contact) => {
    setDeletingContact(contact);
  };

  // Desglosar respuesta de API
  const contacts = data?.data || [];
  const pagination = data?.pagination || { total: 0, totalPages: 1 };
  const schemaWarning = data?.schemaWarning;

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* --- NOTIFICACIONES TOAST PREMIUM --- */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 border rounded-xl shadow-xl animate-slide-in text-xs font-semibold leading-relaxed ${
          toast.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300'
            : 'bg-rose-50 dark:bg-rose-950/90 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Cartera de Clientes / Contactos
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visualiza, busca, filtra y gestiona los clientes activos de cobranza.
          </p>
        </div>

        <button
          onClick={handleCreateOpen}
          className="flex items-center justify-center gap-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl px-4 py-2.5 font-semibold text-xs transition-all shadow-md shadow-indigo-650/10 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Crear Contacto
        </button>
      </div>

      {/* Advertencia si no se ha corrido la migración en Supabase */}
      {schemaWarning && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl flex items-start gap-3 text-amber-800 dark:text-amber-400">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold">Esquema de Base de Datos Incompleto</p>
            <p className="text-[10px] text-amber-700 dark:text-amber-500 mt-0.5 leading-relaxed">
              El Backend ha detectado que falta la columna <strong>"deleted_at"</strong> en tu base de datos de Supabase. El Soft Delete estará inhabilitado temporalmente hasta que ejecutes el script SQL <code>"migration_add_deleted_at.sql"</code>.
            </p>
          </div>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <ContactsFilters
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
      />

      {/* --- CAPA DE RENDERIZACIÓN DE ESTADOS --- */}
      {isLoading ? (
        <ContactsSkeleton />
      ) : isError ? (
        <ContactsError 
          message={error.response?.data?.error?.message || error.message} 
          onRetry={() => refetch()} 
        />
      ) : contacts.length === 0 ? (
        <ContactsEmpty onCreateClick={handleCreateOpen} />
      ) : (
        <div className="space-y-4">
          
          {/* Tabla de Resultados */}
          <ContactsTable
            contacts={contacts}
            onEditClick={handleEditOpen}
            onDeleteClick={handleDeleteOpen}
          />

          {/* Controles de Paginación */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-900 pt-4 px-2">
              <span className="text-[11px] font-semibold text-slate-500 select-none">
                Página {pagination.page} de {pagination.totalPages} ({pagination.total} clientes totales)
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="p-1.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-850 dark:hover:text-slate-200 rounded-lg disabled:opacity-40 transition-all select-none"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  className="p-1.5 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-850 dark:hover:text-slate-200 rounded-lg disabled:opacity-40 transition-all select-none"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- MODAL PARA CREACIÓN / EDICIÓN (FORMIK + YUP) --- */}
      <ContactFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        contact={editingContact}
        onSubmit={handleFormSubmit}
        isSubmitting={isCreating || isUpdating}
      />

      {/* --- DIÁLOGO DE CONFIRMACIÓN DE SOFT DELETE --- */}
      <ConfirmDeleteDialog
        isOpen={!!deletingContact}
        onClose={() => setDeletingContact(null)}
        contact={deletingContact}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

    </div>
  );
}
