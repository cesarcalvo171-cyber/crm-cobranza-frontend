import { Component } from 'react';
import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';

/**
 * ErrorBoundary
 * ─────────────────────────────────────────────────────────────────────────────
 * Captura errores de React en el árbol de componentes hijos y muestra un
 * fallback premium en lugar de crashear toda la aplicación.
 *
 * Compatible con React 18. Debe ser un Class Component (limitación de React).
 *
 * Uso:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 *
 * Con fallback personalizado:
 *   <ErrorBoundary fallback={<MiPantallaDeError />}>
 *     <Feature />
 *   </ErrorBoundary>
 * ─────────────────────────────────────────────────────────────────────────────
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  // Se invoca al lanzarse un error en cualquier componente hijo
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  // Recibe el error y el stack de componentes afectados
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Logging estructurado — preparado para integrarse con Sentry/Datadog
    console.error('[ERROR BOUNDARY] Error capturado en árbol React:', {
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
    });
  }

  handleReload = () => {
    // Limpiar el estado del boundary antes de recargar
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Si el padre provee un fallback personalizado, usarlo
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.state.error?.message || 'Error desconocido';
      const isDev = import.meta.env.DEV;

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
          <div className="w-full max-w-md">
            {/* Tarjeta principal */}
            <div className="bg-white dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-8 shadow-xl shadow-rose-500/5">

              {/* Ícono de error */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-rose-500" />
                  </div>
                  {/* Pulso animado */}
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full animate-ping opacity-40" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full" />
                </div>
              </div>

              {/* Título */}
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Algo salió mal
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  El sistema encontró un error inesperado. Puedes intentar recargar la página o contactar soporte si el problema persiste.
                </p>
              </div>

              {/* Detalle del error (solo en desarrollo) */}
              {isDev && errorMessage && (
                <div className="mb-6 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Terminal className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Dev — Error Detail
                    </span>
                  </div>
                  <p className="text-xs font-mono text-rose-600 dark:text-rose-400 leading-relaxed break-all">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Acciones */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={this.handleReload}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white rounded-xl py-2.5 text-sm font-semibold transition-all shadow-md shadow-indigo-600/20"
                >
                  <RefreshCw className="w-4 h-4" />
                  Recargar página
                </button>

                <button
                  onClick={this.handleReset}
                  className="w-full flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl py-2.5 text-sm font-medium transition-all active:scale-[0.98]"
                >
                  Intentar sin recargar
                </button>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-4">
              CRM Cobranza · Si el error continúa, contacta a soporte técnico.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
