import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';

export function ContactsFilters({ search, onSearchChange, status, onStatusChange }) {
  const [localSearch, setLocalSearch] = useState(search);

  // Debounce de 300ms para la búsqueda en tiempo real
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearch]);

  // Si cambia la búsqueda desde afuera (ej. al resetear), actualizar local
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleClearFilters = () => {
    setLocalSearch('');
    onStatusChange('');
  };

  const hasActiveFilters = localSearch.trim() !== '' || status !== '';

  const statuses = [
    { label: 'Todos', value: '' },
    { label: 'Activo', value: 'active', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    { label: 'En Mora', value: 'overdue', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
    { label: 'Inactivo', value: 'inactive', color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900/10 border border-slate-200 dark:border-slate-900 p-4 rounded-2xl shadow-sm">
      
      {/* Buscador debounced */}
      <div className="relative flex-1 max-w-md">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Buscar por nombre, número de cliente, WhatsApp o correo..."
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 rounded-xl py-2 pl-10 pr-10 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
        />
        {localSearch && (
          <button
            onClick={() => setLocalSearch('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Selector de Filtros por Estatus */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Estatus:</span>
        </div>

        <div className="flex bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-1 rounded-xl gap-1">
          {statuses.map((item) => (
            <button
              key={item.label}
              onClick={() => onStatusChange(item.value)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                status === item.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-900/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Botón de limpiar filtros */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 px-2 py-1 transition-all duration-200"
          >
            Limpiar Filtros
          </button>
        )}
      </div>

    </div>
  );
}
