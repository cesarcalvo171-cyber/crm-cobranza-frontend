import React from 'react';
import { Users, ShieldAlert, Sparkles, RefreshCcw } from 'lucide-react';

// 1. Cargador de Esqueletos (Skeletons) para la tabla
export function ContactsSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-10 bg-slate-900 border border-slate-900 rounded-xl"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border border-slate-900/60 rounded-xl bg-slate-900/20">
          <div className="flex gap-4 items-center">
            <div className="w-9 h-9 bg-slate-800 rounded-lg"></div>
            <div className="space-y-2">
              <div className="w-32 h-4 bg-slate-800 rounded"></div>
              <div className="w-24 h-3 bg-slate-800 rounded"></div>
            </div>
          </div>
          <div className="w-16 h-4 bg-slate-800 rounded"></div>
          <div className="w-12 h-6 bg-slate-800 rounded-full"></div>
        </div>
      ))}
    </div>
  );
}

// 2. Estado Vacío (Empty State)
export function ContactsEmpty({ onCreateClick }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800/80 rounded-2xl bg-slate-900/10 text-center animate-fade-in">
      <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-4 text-indigo-400">
        <Users className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-200">No hay contactos</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
        Comienza cargando un archivo CSV o crea un contacto de forma manual para iniciar campañas de cobro.
      </p>
      {onCreateClick && (
        <button
          onClick={onCreateClick}
          className="mt-5 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 font-medium text-xs transition-all duration-200 border border-indigo-500/20 active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Crear Contacto
        </button>
      )}
    </div>
  );
}

// 3. Estado de Error (Error State)
export function ContactsError({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 border border-red-950/20 rounded-2xl bg-red-950/5 text-center animate-fade-in">
      <div className="w-12 h-12 bg-red-950/40 border border-red-800/30 rounded-2xl flex items-center justify-center mb-4 text-red-400">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-200">Error al consultar datos</h3>
      <p className="text-xs text-red-300 mt-1 max-w-xs leading-relaxed">
        {message || 'Ocurrió un error al intentar conectarse al Backend Express.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-slate-100 rounded-xl px-4 py-2 font-medium text-xs transition-all duration-200 active:scale-[0.98]"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Reintentar Carga
        </button>
      )}
    </div>
  );
}
