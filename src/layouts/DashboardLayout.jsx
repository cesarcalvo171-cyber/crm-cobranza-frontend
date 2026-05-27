import  { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { useTheme } from '../providers/ThemeProvider';
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  ChevronRight,
  UserCheck
} from 'lucide-react';

export function DashboardLayout() {
  
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Contactos', path: '/contacts', icon: Users, badge: 'Real' },
    { name: 'Campañas', path: '/campaigns', icon: Megaphone, disabled: true },
    { name: 'Ajustes', path: '/settings', icon: Settings, disabled: true },
  ];

  const getPageTitle = () => {
    const current = navItems.find(item => location.pathname.startsWith(item.path));
    return current ? current.name : 'CRM Cobranza';
  };

  return (

    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex relative overflow-hidden font-sans transition-colors duration-200">
      
     
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* --- SIDEBAR DESKTOP --- */}
      {/* 2. CAMBIO: Bordes y fondos condicionales para soportar el modo claro */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 shrink-0 select-none transition-colors duration-200">
        {/* Header de Sidebar */}
        <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-900 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-lg flex items-center justify-center border border-indigo-400/20">
            <UserCheck className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif font-bold text-base tracking-wide bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            CRM Cobranza
          </span>
        </div>

        {/* Links de Navegación */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            
            if (item.disabled) {
              return (
                <div 
                  key={item.name} 
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 dark:text-slate-600 cursor-not-allowed"
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  <span>{item.name}</span>
                  <span className="ml-auto text-[9px] font-bold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 px-1.5 py-0.5 rounded">Prox</span>
                </div>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/15'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60 border border-transparent'
                  }`
                }
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-auto text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer de Sidebar (Perfil y Logout) */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950">
          <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900 rounded-xl mb-3">
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center font-bold text-sm text-indigo-600 dark:text-indigo-400">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{user?.email}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Agente de Cobro</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-900 hover:border-red-200 dark:hover:border-red-900/20 text-slate-500 dark:text-slate-400 hover:text-red-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/10 rounded-xl text-xs font-medium transition-all duration-200 active:scale-[0.98]"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* --- SIDEBAR MOBILE --- */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/40 dark:bg-slate-950/80 backdrop-blur-sm flex">
          <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-900 flex flex-col h-full">
            <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-900 flex items-center justify-between">
              <span className="font-serif font-bold text-base bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                CRM Cobranza
              </span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                if (item.disabled) return null;

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/15'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                      }`
                    }
                  >
                    <Icon className="w-4.5 h-4.5" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-900">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-900 text-slate-500 dark:text-slate-400 hover:text-red-500 rounded-xl text-xs font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                Cerrar Sesión
              </button>
            </div>
          </aside>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}

      {/* --- CONTENEDOR CENTRAL --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* --- HEADER / TOPBAR --- */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-900 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-20 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 p-1"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Badge de estado de conexión */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Backend Conectado</span>
            </div>

            {/* Alternador de Tema Oscuro/Claro (Optimizado) */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-900 hover:border-slate-300 dark:hover:border-slate-800 rounded-xl transition-all duration-200 bg-white dark:bg-slate-950"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
          </div>
        </header>

        {/* --- PANEL DE VISTA ACTIVA --- */}
        <main className="flex-1 p-6 overflow-y-auto z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}