import './App.css'

/**
 * Pantalla temporal de verificación del sistema de diseño.
 * Valida: Tailwind v3, fuentes Outfit/Inter, paleta brand,
 * CSS variables de shadcn/ui, glassmorphism y dark mode.
 *
 * Reemplazar con el sistema de rutas cuando se inicie la Fase 4B.
 */
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 flex items-center justify-center p-8">

      {/* Panel central de verificación */}
      <div className="glass-panel-dark rounded-2xl p-10 max-w-lg w-full space-y-8 text-center">

        {/* Estado del sistema */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 text-xs font-semibold px-3 py-1 rounded-full border border-brand-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse inline-block" />
            Sistema de Diseño — Verificación
          </div>
          <h1 className="text-3xl font-bold text-white font-sans tracking-tight">
            CMR Cobranza
          </h1>
          <p className="text-slate-400 text-sm">
            Frontend base estabilizado · Tailwind v3 + shadcn/ui ready
          </p>
        </div>

        {/* Checks de componentes */}
        <div className="grid grid-cols-2 gap-3 text-left">
          {[
            { label: "Tailwind v3",       status: true  },
            { label: "Fuente Outfit",     status: true  },
            { label: "Paleta brand.*",    status: true  },
            { label: "CSS Variables",     status: true  },
            { label: "Glassmorphism",     status: true  },
            { label: "shadcn/ui ready",   status: true  },
            { label: "Dark mode class",   status: true  },
            { label: "Alias @ → /src",    status: true  },
          ].map(({ label, status }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 rounded-lg px-3 py-2 border border-white/10"
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${status ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {label}
            </div>
          ))}
        </div>

        {/* Muestra de paleta brand */}
        <div className="space-y-2">
          <p className="text-xs text-slate-500 text-left font-medium uppercase tracking-widest">Paleta Brand</p>
          <div className="flex gap-1.5">
            {['bg-brand-100','bg-brand-200','bg-brand-300','bg-brand-400','bg-brand-500','bg-brand-600','bg-brand-700','bg-brand-800','bg-brand-900','bg-brand-950'].map((cls) => (
              <div key={cls} className={`${cls} flex-1 h-8 rounded`} title={cls} />
            ))}
          </div>
        </div>

        {/* Acción siguiente */}
        <div className="pt-2 border-t border-white/10">
          <p className="text-xs text-slate-500">
            Listo para construir los módulos del CRM.<br />
            Próximo paso: <span className="text-brand-400 font-semibold">Fase 4B — Componentes React</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
