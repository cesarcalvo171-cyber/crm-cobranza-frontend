import { useState, useEffect } from 'react';

/**
 * useDebounce
 * ─────────────────────────────────────────────────────────────────────────────
 * Retrasa la actualización de un valor hasta que el usuario deja de cambiarlo
 * por `delay` milisegundos. Ideal para evitar requests por cada keystroke.
 *
 * @template T
 * @param {T} value   - Valor a "debouncear"
 * @param {number} delay - Tiempo de espera en ms (default: 350)
 * @returns {T} Valor debounced
 *
 * @example
 * const debouncedSearch = useDebounce(search, 350);
 * // React Query solo dispara cuando debouncedSearch cambia (no por keystroke)
 */
export function useDebounce(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancela el timer si value o delay cambia antes de que expire
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
