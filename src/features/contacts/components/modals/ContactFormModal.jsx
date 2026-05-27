import React, { useEffect, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { contactValidationSchema } from '../../validations/contacts';
import { X, Loader2, Sparkles, UserCheck, ShieldAlert } from 'lucide-react';

export function ContactFormModal({ isOpen, onClose, contact, onSubmit, isSubmitting }) {
  const modalRef = useRef(null);
  const initialInputRef = useRef(null);

  const isEdit = !!contact;

  // 1. Cierre con tecla Escape + Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    // Guardar elemento enfocado anteriormente para restaurar al cerrar
    const activeElementBeforeModal = document.activeElement;

    const handleKeyDown = (e) => {
      // Cierre con Escape
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus Trap en Tab
      if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Tab hacia atrás
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          // Tab hacia adelante
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Autofocus inteligente al abrir
    setTimeout(() => {
      if (initialInputRef.current) {
        initialInputRef.current.focus();
      }
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (activeElementBeforeModal && typeof activeElementBeforeModal.focus === 'function') {
        activeElementBeforeModal.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const initialValues = {
    customer_number: contact?.customer_number || '',
    name: contact?.name || '',
    whatsapp_number: contact?.whatsapp_number || '',
    sms_number: contact?.sms_number || '',
    email: contact?.email || '',
    status: contact?.status || 'active',
  };

  const handleFormikSubmit = async (values, { setSubmitting }) => {
    try {
      await onSubmit(values);
      onClose();
    } catch (err) {
      console.error('[FORM SUBMIT ERROR]', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        ref={modalRef}
        className="w-full max-w-lg bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative overflow-hidden animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Luces decorativas */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>

        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
              {isEdit ? <UserCheck className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {isEdit ? 'Editar Contacto' : 'Crear Contacto'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isEdit ? 'Modifica los datos del cliente en el CRM.' : 'Registra un nuevo contacto manual de cobranza.'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario Formik */}
        <Formik
          initialValues={initialValues}
          validationSchema={contactValidationSchema}
          onSubmit={handleFormikSubmit}
        >
          {({ errors, touched, isSubmitting: formikSubmitting }) => {
            return (
              <Form className="space-y-4">
                {/* Alerta general si Yup valida que falte al menos un teléfono */}
                {errors[''] && (touched.whatsapp_number || touched.sms_number) && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-xl flex items-start gap-2.5 text-rose-600 dark:text-rose-400">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-medium leading-relaxed">{errors['']}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* Número de Cliente */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1" htmlFor="customer_number">
                      Número de Cliente
                    </label>
                    <Field
                      name="customer_number"
                      type="text"
                      id="customer_number"
                      placeholder="CLI-1004"
                      disabled={isEdit} // No permitir editar la clave única del cliente
                      innerRef={isEdit ? null : initialInputRef}
                      className={`w-full bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-700 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${
                        isEdit ? 'opacity-50 cursor-not-allowed border-slate-200 dark:border-slate-800' : 
                        errors.customer_number && touched.customer_number
                          ? 'border-rose-500 focus:ring-rose-500'
                          : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
                      }`}
                    />
                    <ErrorMessage name="customer_number" component="div" className="text-[10px] font-medium text-rose-500 mt-1 pl-1" />
                  </div>

                  {/* Estatus */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1" htmlFor="status">
                      Estatus del Cliente
                    </label>
                    <Field
                      as="select"
                      name="status"
                      id="status"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                    >
                      <option value="active">Activo</option>
                      <option value="overdue">En Mora</option>
                      <option value="inactive">Inactivo</option>
                    </Field>
                    <ErrorMessage name="status" component="div" className="text-[10px] font-medium text-rose-500 mt-1 pl-1" />
                  </div>
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1" htmlFor="name">
                    Nombre del Cliente
                  </label>
                  <Field
                    name="name"
                    type="text"
                    id="name"
                    placeholder="Alejandro Fernández"
                    innerRef={isEdit ? initialInputRef : null}
                    className={`w-full bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-700 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${
                      errors.name && touched.name
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
                    }`}
                  />
                  <ErrorMessage name="name" component="div" className="text-[10px] font-medium text-rose-500 mt-1 pl-1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* WhatsApp */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1" htmlFor="whatsapp_number">
                      Número de WhatsApp
                    </label>
                    <Field
                      name="whatsapp_number"
                      type="text"
                      id="whatsapp_number"
                      placeholder="5215512345678"
                      className={`w-full bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-700 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${
                        errors.whatsapp_number && touched.whatsapp_number
                          ? 'border-rose-500 focus:ring-rose-500'
                          : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
                      }`}
                    />
                    <ErrorMessage name="whatsapp_number" component="div" className="text-[10px] font-medium text-rose-500 mt-1 pl-1" />
                  </div>

                  {/* SMS */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1" htmlFor="sms_number">
                      Teléfono SMS
                    </label>
                    <Field
                      name="sms_number"
                      type="text"
                      id="sms_number"
                      placeholder="5215598765432"
                      className={`w-full bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-700 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${
                        errors.sms_number && touched.sms_number
                          ? 'border-rose-500 focus:ring-rose-500'
                          : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
                      }`}
                    />
                    <ErrorMessage name="sms_number" component="div" className="text-[10px] font-medium text-rose-500 mt-1 pl-1" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1" htmlFor="email">
                    Correo Electrónico
                  </label>
                  <Field
                    name="email"
                    type="email"
                    id="email"
                    placeholder="alejandro@empresa.com"
                    className={`w-full bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-700 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all ${
                      errors.email && touched.email
                        ? 'border-rose-500 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
                    }`}
                  />
                  <ErrorMessage name="email" component="div" className="text-[10px] font-medium text-rose-500 mt-1 pl-1" />
                </div>

                {/* Botonera de Envío */}
                <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl font-semibold text-xs transition-all active:scale-[0.98]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || formikSubmitting}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-5 py-2 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-indigo-650/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {(isSubmitting || formikSubmitting) ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      'Guardar Contacto'
                    )}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
