/**
 * Client-side Supabase Client
 * Utilisé partout (Client Components, RSC, edge functions)
 * Clé ANON pour sécurité - accès limité par RLS policies
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Exporter aussi les constantes pour réutilisation
export const SUPABASE_CONFIG = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
  storageUrl: `${SUPABASE_URL}/storage/v1/object/public`,
} as const;

// Créer le client uniquement si les variables sont disponibles
export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : (null as any);

// Debug logging
if (typeof window !== 'undefined') {
  if (supabase) {
    console.log('[Supabase Client] ✅ Client initialized with ANON_KEY');
  } else {
    console.warn('[Supabase Client] ❌ Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
}
