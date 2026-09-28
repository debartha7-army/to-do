import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
let isConnected = false;

if (supabaseUrl && supabaseKey && !supabaseKey.includes('your_supabase_service_role_key')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log(`[Database] Supabase client initialized for: ${supabaseUrl}`);
  } catch (err) {
    console.warn('[Database] Failed to initialize Supabase client:', err.message);
  }
} else {
  console.warn('[Database] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. Operating in local fallback mode.');
}

export { supabase };

export const checkSupabaseConnection = async () => {
  if (!supabase) return false;
  try {
    const { data, error } = await supabase.from('discoveries').select('id').limit(1);
    if (error) {
      console.warn('[Database] Supabase table check notice:', error.message);
      return false;
    }
    isConnected = true;
    return true;
  } catch (err) {
    console.warn('[Database] Supabase connection test error:', err.message);
    return false;
  }
};
