import { createClient } from '@supabase/supabase-js';

// Access environment variables using Vite's standard `import.meta.env` object.
// FIX: Cast `import.meta` to `any` to bypass TypeScript error. This occurs when Vite's client types are not loaded, and is a safe workaround as Vite guarantees `import.meta.env` exists at runtime.
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
// FIX: Cast `import.meta` to `any` to bypass TypeScript error. This occurs when Vite's client types are not loaded, and is a safe workaround as Vite guarantees `import.meta.env` exists at runtime.
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    }
});