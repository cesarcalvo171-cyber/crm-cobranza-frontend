import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

export function ConfirmDeleteDialog({ isOpen, onClose, contact, onConfirm, isDeleting }) {
  const dialogRef = useRef(null);

  // Focus Trap + Escape key close
  useEffect(() => {
    if (!isOpen) return;

    const activeElementBeforeDialog = document.activeElement;

    const handleKeyDown = (e) => {
      // Escape close
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus Trap
      if (e.key === 'Tab') {
        if (!dialogRef.current) return;
        const focusableElements = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Tab backwards
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          // Tab forwards
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Autofocus on Cancel button for safety (destructive action prevention)
    setTimeout(() => {
      if (dialogRef.current) {
        const cancelButton = dialogRef.current.querySelector('button');
        if (cancelButton) cancelButton.focus();
      }
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (activeElementBeforeDialog && typeof activeElementBeforeDialog.focus === 'function') {
        activeElementBeforeDialog.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen || !contact) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        ref={dialogRef}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center text-rose-500 shrink-0">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Confirmar Baja de Contacto
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              ¿Estás seguro de que deseas dar de baja a <strong className="text-slate-700 dark:text-slate-200">{contact.name}</strong> ({contact.customer_number})?
            </p>
          </div>
          <button 
            onClick={onClose}
            aria-label="Cerrar modal de eliminación"
            className="p-1 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mensaje de Soft Delete */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-850 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          ⚠️ <strong>Nota:</strong> Esta acción realiza una <strong>baja suave (Soft Delete)</strong>. El cliente no se borrará físicamente del sistema, pero se ocultará del CRM y se inhabilitará para futuros envíos de cobranza. Podrás reactivarlo en cualquier momento subiendo sus datos nuevamente por CSV.
        </div>

        {/* Botonera */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl font-semibold text-xs transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(contact.id)}
            disabled={isDeleting}
            className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl px-5 py-2 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-rose-650/10 active:scale-[0.98] disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Dando de baja...
              </>
            ) : (
              'Confirmar Baja'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
