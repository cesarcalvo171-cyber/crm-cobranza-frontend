import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina clases de Tailwind de forma inteligente:
 * - clsx: maneja condicionales y arreglos de clases
 * - twMerge: resuelve conflictos entre clases Tailwind (ej. p-4 vs p-6 → gana el último)
 *
 * Requerida por todos los componentes de shadcn/ui.
 *
 * @example
 *   cn("px-4 py-2", isActive && "bg-brand-500", className)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
