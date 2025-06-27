
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ngfwenmxbgbytzhqesas.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nZndlbm14YmdieXR6aHFlc2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5Njg0OTksImV4cCI6MjA2NTU0NDQ5OX0.l0uuVeXnBBO6tMVRg03YxWkIggY7J3BUNMCiydzCvC4";

// More robust client options, recommended by Supabase for auth reliability!
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
