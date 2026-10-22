import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserRole } from './contentRepository';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Check whether genuine, non-placeholder credentials have been configured
export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project.supabase.co') &&
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export interface ProfileRecord {
  id: string;
  display_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export const getSupabaseConfigStatus = () => {
  if (isSupabaseConfigured) {
    return {
      configured: true,
      url: supabaseUrl,
      mode: 'Managed Supabase Database',
    };
  }
  return {
    configured: false,
    url: null,
    mode: 'Local Newsroom Demo Repository (Configure .env for Supabase)',
  };
};
