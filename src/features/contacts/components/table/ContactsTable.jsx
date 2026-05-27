import React from 'react';
import { Edit2, Trash2, Mail, Phone, ShieldAlert, CheckCircle, HelpCircle } from 'lucide-react';

export function ContactsTable({ contacts, onEditClick, onDeleteClick }) {
  
  // Mapear badges de estatus de forma premium
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" />
            Activo
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            En Mora
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400">
            <HelpCircle className="w-3.5 h-3.5" />
            Inactivo
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-500">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900/10 border border-slate-200 dark:border-slate-900 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20 text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider select-none">
              <th className="py-4 px-6">Cliente / Cuenta</th>
              <th className="py-4 px-6">Medios de Contacto</th>
              <th className="py-4 px-6 text-center">Estado</th>
              <th className="py-4 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-sm text-slate-800 dark:text-slate-200">
            {contacts.map((contact) => (
              <tr 
                key={contact.id} 
                className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-all duration-150 group"
              >
                {/* Nombre y Número de Cliente */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg flex items-center justify-center font-bold text-xs text-indigo-500 dark:text-indigo-400">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[180px]">{contact.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono tracking-tight mt-0.5">{contact.customer_number}</p>
                    </div>
                  </div>
                </td>

                {/* WhatsApp, SMS y Email */}
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-1 text-xs">
                    {contact.whatsapp_number && (
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{contact.whatsapp_number}</span>
                        <span className="text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-450 border border-indigo-100 dark:border-indigo-900/50 px-1 py-0.2 rounded shrink-0 scale-95">WA</span>
                      </div>
                    )}
                    {contact.sms_number && (
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{contact.sms_number}</span>
                        <span className="text-[9px] font-bold bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-450 border border-violet-100 dark:border-violet-900/50 px-1 py-0.2 rounded shrink-0 scale-95">SMS</span>
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center gap-1.5 text-slate-450 dark:text-slate-500">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[180px]">{contact.email}</span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Badge de Estatus */}
                <td className="py-4 px-6 text-center align-middle">
                  {renderStatusBadge(contact.status)}
                </td>

                {/* Acciones de Edición y Borrado */}
                <td className="py-4 px-6 text-right align-middle">
                  <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditClick(contact)}
                      title="Editar contacto"
                      aria-label={`Editar contacto ${contact.name}`}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteClick(contact)}
                      title="Dar de baja (Soft Delete)"
                      aria-label={`Dar de baja contacto ${contact.name}`}
                      className="p-1.5 text-slate-400 hover:text-red-650 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent hover:border-red-100 dark:hover:border-red-950 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
