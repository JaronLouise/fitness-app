import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

export const supabase = createClient(
  Constants.expoConfig.extra.SUPABASE_URL,
  Constants.expoConfig.extra.SUPABASE_KEY
);
