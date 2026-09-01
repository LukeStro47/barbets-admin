'use server';

import { createClient } from '@/lib/supabase/server';
import { friendlyMessage, toActionError, type ActionResult } from '@/lib/errors';

export type UserEngagementSegment = 'new' | 'power' | 'casual' | 'at_risk' | 'dormant' | 'churned';

export interface UserSegmentRow {
  segment: UserEngagementSegment;
  user_count: number;
  pct_of_total: number | null;
  median_bets_per_week: number | null;
  median_active_memberships: number | null;
  median_tenure_days: number | null;
}

export async function listUserSegments(): Promise<ActionResult<UserSegmentRow[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_user_segments');
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as UserSegmentRow[] };
}

export interface ActivityMixRow {
  mix_type: 'bettor_only' | 'creator_or_sponsor' | 'bettor_and_creator' | 'joiner_never_bets';
  user_count: number;
}

export async function listUserActivityMix(days = 90): Promise<ActionResult<ActivityMixRow[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_user_activity_mix', { p_days: days });
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as ActivityMixRow[] };
}

export interface MultiGroupBucket {
  active_membership_bucket: string;
  user_count: number;
}

export async function listUserMultiGroupDistribution(): Promise<ActionResult<MultiGroupBucket[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_user_multigroup_distribution');
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as MultiGroupBucket[] };
}

export interface MembershipChurn {
  total_joins: number;
  early_churn: number;
  late_churn: number;
  still_here: number;
  early_churn_rate: number | null;
  late_churn_rate: number | null;
}

export async function getMembershipChurn(joinWindowDays = 180): Promise<ActionResult<MembershipChurn>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_membership_churn', { p_join_window_days: joinWindowDays }).single();
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: data as MembershipChurn };
}
