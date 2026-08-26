'use server';

import { createClient } from '@/lib/supabase/server';
import { friendlyMessage, toActionError, type ActionResult } from '@/lib/errors';

export interface SignupDay {
  day: string;
  signups: number;
}

export async function listSignupsPerDay(days = 90): Promise<ActionResult<SignupDay[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_signups_per_day', { p_days: days });
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as SignupDay[] };
}

export interface WauMauWeek {
  period_start: string;
  wau: number;
  mau: number;
}

export async function listWauMau(weeks = 26): Promise<ActionResult<WauMauWeek[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_wau_mau', { p_weeks: weeks });
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as WauMauWeek[] };
}

export interface RetentionCohortRow {
  cohort_week: string;
  weeks_since_signup: number;
  cohort_size: number;
  active_users: number;
}

export async function listRetentionCohorts(cohortWeeks = 12): Promise<ActionResult<RetentionCohortRow[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_retention_cohorts', { p_cohort_weeks: cohortWeeks });
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as RetentionCohortRow[] };
}

export interface LifecycleEventTotal {
  event_type: string;
  event_count: number;
}

export async function listLifecycleEventTotals(days = 30): Promise<ActionResult<LifecycleEventTotal[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_lifecycle_event_totals', { p_days: days });
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as LifecycleEventTotal[] };
}
