import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Replace with your Supabase project URL and Anon Key.
// You can find these in your Supabase project settings under API.
const supabaseUrl = 'https://bypapqacsurvjgnzuvir.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5cGFwcWFjc3Vydmpnbnp1dmlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDQ0MTUsImV4cCI6MjA3NDEyMDQxNX0.Qv-SfJeHhusKXu6RU3CdwpHTuXGAnkuixaVK_tcQ_Mk';

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);