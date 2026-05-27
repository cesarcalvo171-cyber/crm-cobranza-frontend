import React from 'react';
import { useDashboardStats } from './hooks/useDashboard';
import { 
  Users, 
  Wallet, 
  ShieldAlert, 
  Bell, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

export function Dashboard() {
  const { data: stats, isPending, error, refetch, isRefetching } = useDashboardStats();

  const handleRefreshAll = () => {
    refetch();
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(val || 0);
  };

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl dark:bg-rose-950/20 dark:border-rose-900/30 text-rose-800 dark:text-rose-450 animate-fade-in">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" /> Error al cargar el Dashboard
        </h3>
        <p className="text-xs">{error.message || 'Ocurrió un error inesperado al conectar con el servidor.'}</p>
        <button
          onClick={handleRefreshAll}
          className="mt-4 px-3.5 py-2 bg-rose-600 hover:bg-rose-750 text-white rounded-xl text-xs font-semibold shadow-sm transition-all duration-200"
        >
          Reintentar conexión
        </button>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total clientes',
      value: isPending ? 'Cargando...' : stats?.totalCustomers,
      description: 'Clientes activos registrados',
      icon: Users,
      color: 'bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-450 border-indigo-100 dark:border-indigo-500/10',
    },
    {
      title: 'En mora',
      value: isPending ? 'Cargando...' : stats?.overdueCustomers,
      description: 'Clientes con estatus "overdue"',
      icon: ShieldAlert,
      color: 'bg-rose-50 dark:bg-rose-600/10 text-rose-600 dark:text-rose-450 border-rose-100 dark:border-rose-500/10',
    },
    {
      title: 'Dinero en mora',
      value: isPending ? 'Cargando...' : formatCurrency(stats?.totalDebt),
      description: 'Suma de créditos vencidos',
      icon: Wallet,
      color: 'bg-amber-50 dark:bg-amber-600/10 text-amber-600 dark:text-amber-450 border-amber-100 dark:border-amber-500/10',
    },
    {
      title: 'Notificaciones hoy',
      value: isPending ? 'Cargando...' : stats?.notificationsToday,
      description: 'Enviadas en las últimas 24h',
      icon: Bell,
      color: 'bg-violet-50 dark:bg-violet-600/10 text-violet-600 dark:text-violet-450 border-violet-100 dark:border-violet-500/10',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Encabezado del Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Panel de Control Principal
            <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-450" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Métricas clave e indicadores de rendimiento de cobranza del sistema en tiempo real.
          </p>
        </div>

        <button
          onClick={handleRefreshAll}
          disabled={isPending || isRefetching}
          className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 dark:border-slate-900 hover:border-slate-300 dark:hover:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 bg-white dark:bg-slate-900/35 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ${(isPending || isRefetching) ? 'animate-spin' : ''}`} />
          Refrescar Métricas
        </button>
      </div>

      {/* Cuadrícula de Tarjetas con las Métricas Requeridas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.title} 
              className="bg-white dark:bg-slate-900/30 backdrop-blur-md border border-slate-200 dark:border-slate-900 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 relative group"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{item.title}</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif tracking-tight">{item.value}</h3>
                </div>
                <div className={`p-2.5 rounded-xl border ${item.color}`}>
                  <Icon className="w-5 h-5 shrink-0" />
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
