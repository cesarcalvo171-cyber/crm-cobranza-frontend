import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  Bell, 
  Activity, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

export function Dashboard() {
  // Consultar total de clientes en tiempo real en la base de datos de Supabase
  const { data: totalCustomers, isLoading: loadingCustomers, refetch } = useQuery({
    queryKey: ['totalCustomersCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .is('deleted_at', null);

      if (error) throw error;
      return count || 0;
    }
  });

  const cards = [
    {
      title: 'Total Clientes (Mora)',
      value: loadingCustomers ? '...' : totalCustomers,
      description: 'Clientes activos en cartera',
      icon: Users,
      color: 'from-indigo-600/10 to-indigo-500/5 text-indigo-400 border-indigo-500/10',
    },
    {
      title: 'Dinero en Mora (USD)',
      value: '$45,820.00',
      description: 'Monto total pendiente de cobro',
      icon: Wallet,
      color: 'from-amber-600/10 to-amber-500/5 text-amber-400 border-amber-500/10',
      badge: 'Proximamente',
    },
    {
      title: 'Notificaciones Enviadas',
      value: '142',
      description: 'Envíos procesados hoy',
      icon: Bell,
      color: 'from-violet-600/10 to-violet-500/5 text-violet-400 border-violet-500/10',
    },
    {
      title: 'Tasa de Entrega',
      value: '98.6%',
      description: 'WhatsApp/SMS/Email entregados',
      icon: TrendingUp,
      color: 'from-emerald-600/10 to-emerald-500/5 text-emerald-400 border-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Encabezado Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            Vista Rápida de Métricas
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervisa el estado global de la cobranza y notificaciones del día.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-1.5 border border-slate-900 hover:border-slate-800 text-xs font-semibold text-slate-300 hover:text-slate-100 bg-slate-900/30 rounded-xl transition-all duration-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Sincronizar Datos
        </button>
      </div>

      {/* Grid de Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.title} 
              className={`bg-slate-900/30 backdrop-blur-md border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 hover:border-slate-800/80 hover:bg-slate-900/40 relative group ${card.color.split(' ')[2]}`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{card.title}</p>
                  <h3 className="text-2xl font-bold text-slate-100 font-serif tracking-tight">{card.value}</h3>
                </div>
                <div className={`p-2.5 bg-gradient-to-tr rounded-xl border ${card.color.split(' ')[0]} ${card.color.split(' ')[1]} ${card.color.split(' ')[3]}`}>
                  <Icon className="w-5 h-5 shrink-0" />
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">{card.description}</p>
                {card.badge && (
                  <span className="text-[9px] font-bold bg-slate-900/80 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                    {card.badge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Secciones de Contenido / Gráficos de Demostración */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registro de actividades recientes */}
        <div className="lg:col-span-2 bg-slate-900/10 backdrop-blur-md border border-slate-900 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              Notificaciones de Pago en Tiempo Real
            </h3>
            <span className="text-[10px] font-bold bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 px-2 py-0.5 rounded-full">
              Activo
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 border border-slate-900/60 bg-slate-900/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-900/50 flex items-center justify-center font-bold text-xs text-emerald-400">
                  W
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-300">Pago Recibido - Confirmado</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Cliente: Juan Pérez • Tel: +52 551 234 5678</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Hace 2m</span>
            </div>

            <div className="flex items-center justify-between p-3.5 border border-slate-900/60 bg-slate-900/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-900/50 flex items-center justify-center font-bold text-xs text-emerald-400">
                  W
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-300">Aviso Preventivo Enviado</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Cliente: María López • Tel: +52 559 876 5432</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Hace 15m</span>
            </div>
          </div>
        </div>

        {/* Resumen del Sistema */}
        <div className="bg-slate-900/10 backdrop-blur-md border border-slate-900 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Estado del Sistema</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">API Gateway Express</span>
              <span className="font-semibold text-emerald-400">Activo (v1.0.0)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Motor de n8n</span>
              <span className="font-semibold text-indigo-400">Docker (Local)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Base de Datos Supabase</span>
              <span className="font-semibold text-slate-300">PostgreSQL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
