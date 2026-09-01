'use server';

import { createClient } from '@/lib/supabase/server';
import { friendlyMessage, toActionError, type ActionResult } from '@/lib/errors';

export type GroupLifecycleState = 'new' | 'active' | 'cooling' | 'stale' | 'winding_down' | 'intermission' | 'scheduled_for_deletion' | 'dormant';

export interface GroupLifecycleRow {
  group_id: string;
  group_name: string;
  lifecycle_state: GroupLifecycleState;
  member_count: number;
  created_at: string;
  deletion_scheduled_at: string | null;
}

export async function listGroupLifecycleStates(): Promise<ActionResult<GroupLifecycleRow[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_group_lifecycle_states');
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as GroupLifecycleRow[] };
}

export interface GroupLifecycleBenchmark {
  lifecycle_state: GroupLifecycleState;
  group_count: number;
  median_members: number | null;
  median_bets_per_week: number | null;
  median_markets_per_week: number | null;
  median_tenure_days: number | null;
  most_common_season_length: string | null;
}

export async function listGroupLifecycleBenchmarks(): Promise<ActionResult<GroupLifecycleBenchmark[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_group_lifecycle_state_benchmarks');
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as GroupLifecycleBenchmark[] };
}

export interface IntermissionConversion {
  total_intermissions: number;
  converted: number;
  still_intermission: number;
  conversion_rate: number | null;
}

export async function getIntermissionConversion(days = 90): Promise<ActionResult<IntermissionConversion>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_group_intermission_conversion', { p_days: days }).single();
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: data as IntermissionConversion };
}

export interface GroupCohortRow {
  cohort_week: string;
  weeks_since_creation: number;
  cohort_size: number;
  active_groups: number;
}

export async function listGroupCohortRetention(cohortWeeks = 12): Promise<ActionResult<GroupCohortRow[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_group_cohort_retention', { p_cohort_weeks: cohortWeeks });
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as GroupCohortRow[] };
}

export interface GroupSizeEngagementRow {
  group_id: string;
  group_name: string;
  member_count: number;
  bets_per_member_per_week: number;
}

export async function listGroupSizeEngagement(): Promise<ActionResult<GroupSizeEngagementRow[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_group_size_engagement_correlation');
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as GroupSizeEngagementRow[] };
}
