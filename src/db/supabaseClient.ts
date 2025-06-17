import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV } from '../env';

const SUPABASE_URL = ENV.Database_url as string;
const SUPABASE_KEY = ENV.Database_key as string;
const SUPABASE_ANON_KEY = ENV.Database_Anon_key as string;

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
export const supabasePublic: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);