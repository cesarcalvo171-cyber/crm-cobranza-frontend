import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { 
  Users, 
  Wallet, 
  ShieldAlert, 
  Bell, 
  Sparkles,
  RefreshCw,
  TrendingDown
} from 'lucide-react';

export function Dashboard() {
  // 1. Consulta: Total Clientes (count from DB)
  const { data: totalCustomers = 0, isLoading: loadingTotal, refetch: refetchTotal } = useQuery({
    queryKey: ['dashboardTotalCustomers'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null);

      if (error) throw error;
      return count || 0;
    }
  });

  // 2. Consulta: En mora (count where status = overdue)
  const { data: overdueCustomers = 0, isLoading: loadingOverdue, refetch: refetchOverdue } = useQuery({
    queryKey: ['dashboardOverdueCustomers'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'overdue')
        .is('deleted_at', null);

      if (error) throw error;
      return count || 0;
    }
  });

  // 3. Consulta: Dinero en mora (sum of loan amounts where overdue)
  const { data: totalMoneisInArrears = 0, isLoading: loadingMoneis, refetch: refetchMoneis } = useQuery({
    queryKey: ['dashboardMoneisInArrears'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loans')
        .select('amount')
        .eq('status', 'overdue');

      if (error) throw error;
      
      const sum = data?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
      return sum;
    }
  });

  // 4. Consulta: Notificaciones hoy (count where created_at > 24h ago)
  const { data: notificationsToday = 0, isLoading: loadingNotifications, refetch: refetchNotifications } = useQuery({
    queryKey: ['dashboardNotificationsToday'],
    queryFn: async () => {
      const past24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count, error } = await supabase
        .from('notifications_sent')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', past24Hours);

      if (error) throw error;
      return count || 0;
    }
  });

  // Método para sincronizar / refrescar todas las métricas juntas
  const handleRefreshAll = () => {
    refetchTotal();
    refetchOverdue();
    refetchMoneis();
    refetchNotifications();
  };

  const isAnyLoading = loadingTotal || loadingOverdue || loadingMoneis || loadingNotifications;

  // Formatear montos a moneda USD
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(val);
  };

  const metrics = [
    {
      title: 'Total clientes',
      value: loadingTotal ? 'Cargando...' : totalCustomers,
      description: 'Clientes activos registrados',
      icon: Users,
      color: 'from-indigo-600/10 to-indigo-500/5 text-indigo-400 border-indigo-500/10',
    },
    {
      title: 'En mora',
      value: loadingOverdue ? 'Cargando...' : overdueCustomers,
      description: 'Clientes con estatus "overdue"',
      icon: ShieldAlert,
      color: 'from-rose-600/10 to-rose-500/5 text-rose-400 border-rose-500/10',
    },
    {
      title: 'Dinero en mora',
      value: loadingMoneis ? 'Cargando...' : formatCurrency(totalMoneisInArrears),
      description: 'Suma de créditos vencidos',
      icon: Wallet,
      color: 'from-amber-600/10 to-amber-500/5 text-amber-400 border-amber-500/10',
    },
    {
      title: 'Notificaciones hoy',
      value: loadingNotifications ? 'Cargando...' : notificationsToday,
      description: 'Enviadas en las últimas 24h',
      icon: Bell,
      color: 'from-violet-600/10 to-violet-500/5 text-violet-400 border-violet-500/10',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Encabezado del Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            Panel de Control Principal
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Métricas clave e indicadores de rendimiento de cobranza del sistema en tiempo real.
          </p>
        </div>

        <button
          onClick={handleRefreshAll}
          disabled={isAnyLoading}
          className="flex items-center gap-2 px-3.5 py-2 border border-slate-900 hover:border-slate-800 text-xs font-semibold text-slate-300 hover:text-slate-100 bg-slate-900/35 rounded-xl transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnyLoading ? 'animate-spin' : ''}`} />
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
              className="bg-slate-900/30 backdrop-blur-md border border-slate-900 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:border-slate-800/80 hover:bg-slate-900/40 relative group"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.title}</p>
                  <h3 className="text-2xl font-bold text-slate-100 font-serif tracking-tight">{item.value}</h3>
                </div>
                <div className={`p-2.5 bg-gradient-to-tr rounded-xl border ${item.color}`}>
                  <Icon className="w-5 h-5 shrink-0" />
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-xs text-slate-500 font-medium">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Widget Informativo Adicional */}
      <div className="bg-slate-900/10 backdrop-blur-md border border-slate-900 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Conexión con Supabase</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Las métricas mostradas en este panel provienen directamente de las tablas relacionales de tu base de datos Supabase en vivo. Al usar consultas directas y declarativas sincronizadas mediante React Query, garantizas un rendimiento óptimo e información instantánea sin necesidad de alterar tu pasarela de pagos ni los controladores REST de tu servidor Express.
        </p>
      </div>
    </div>
  );
}
