import { createClient } from '@supabase/supabase-js';
import type { Category, Expense, ExpenseType, Settings } from '@/types';

const DEFAULT_SUPABASE_URL = 'https://vrfwajzmmpwawxgblwqi.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_VMpqqYnFRy1YY6cxkxkqRg_nhSGbXqh';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const SHARED_STATE_ID = 'shared';

export interface SharedState {
  expenses: Expense[];
  categories: Category[];
  types: ExpenseType[];
  settings: Settings;
}

export async function loadSharedState(): Promise<SharedState | null> {
  if (!supabaseUrl || !supabaseKey) return null;

  const { data, error } = await supabase
    .from('app_state')
    .select('state')
    .eq('id', SHARED_STATE_ID)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data?.state ?? null;
}

export async function saveSharedState(state: SharedState): Promise<void> {
  if (!supabaseUrl || !supabaseKey) return;

  const { error } = await supabase
    .from('app_state')
    .upsert({ id: SHARED_STATE_ID, state, updated_at: new Date().toISOString() });

  if (error) throw error;
}
