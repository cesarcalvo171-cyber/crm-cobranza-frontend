import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ [SUPABASE CONFIG] Faltan las variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY.'
  );
}

// Inicializar cliente Supabase del lado del cliente
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
