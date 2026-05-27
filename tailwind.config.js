/** @type {import('tailwindcss').Config} */
export default {
  // Modo oscuro vía clase .dark (requerido por shadcn/ui)
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Configuración del contenedor para layouts responsivos
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // ── Paleta Brand Premium (Indigo / Violet) ──────────────────────────
        brand: {
          50:  '#f4f2ff',
          100: '#ebe6ff',
          200: '#d7cfff',
          300: '#b8a9ff',
          400: '#9376ff',
          500: '#6e40ff', // Color principal de acción
          600: '#5c22ff',
          700: '#4d10f5',
          800: '#400bc9',
          900: '#350aa3',
          950: '#1f046e',
        },
        // ── Colores faltantes agregados en Sprint 3 ─────────────────────────
        'indigo-650': '#4338ca',
        'slate-850': '#1a2234',
        // ── Tokens semánticos de shadcn/ui (via CSS variables) ──────────────
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      // ── Radio de bordes semántico ──────────────────────────────────────────
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // ── Tipografía ────────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      // ── Animaciones personalizadas ─────────────────────────────────────────
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)", opacity: "0" },
          to:   { transform: "translateY(0)",    opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down":    "accordion-down 0.2s ease-out",
        "accordion-up":      "accordion-up 0.2s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.3s ease-out",
        "fade-in":           "fade-in 0.2s ease-out",
        "spin-slow":         "spin-slow 8s linear infinite",
      },
    },
  },
  plugins: [
    // Plugin oficial de animaciones (requerido por shadcn/ui)
    require("tailwindcss-animate"),
  ],
}
