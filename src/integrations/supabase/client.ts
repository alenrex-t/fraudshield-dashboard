
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kxjeddacjygdqfttfgpr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4amVkZGFjanlnZHFmdHRmZ3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMzA5ODksImV4cCI6MjA2MDkwNjk4OX0.YKC31gFXCU8ehh_aekHHUUMSFLx_YHxqW2o3_jtWho4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
