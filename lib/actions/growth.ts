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

export interface PhotoProofWeek {
  week: string;
  resolved_markets: number;
  with_photo: number;
  photo_rate: number | null;
}

export async function listPhotoProofUsage(days = 90): Promise<ActionResult<PhotoProofWeek[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_photo_proof_usage', { p_days: days });
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as PhotoProofWeek[] };
}

export interface SeasonLengthRow {
  period_start: string;
  season_length: string;
  season_count: number;
}

export async function listSeasonLengthDistribution(weeks = 26): Promise<ActionResult<SeasonLengthRow[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_season_length_distribution', { p_weeks: weeks });
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as SeasonLengthRow[] };
}

export interface SettingsUpdateWeek {
  week: string;
  updates_total: number;
  updates_basic: number;
  updates_advanced: number;
}

export async function listSettingsUpdateFrequency(days = 90): Promise<ActionResult<SettingsUpdateWeek[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_settings_update_frequency', { p_days: days });
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as SettingsUpdateWeek[] };
}
