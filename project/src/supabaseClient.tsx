import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // SupabaseのURL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // APIキー
export const supabase = createClient(supabaseUrl, supabaseKey);