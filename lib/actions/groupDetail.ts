'use server';

import { createClient } from '@/lib/supabase/server';
import { friendlyMessage, toActionError, type ActionResult } from '@/lib/errors';
import type { GroupLifecycleState } from '@/lib/actions/groups';

export interface GroupDetail {
  id: string;
  name: string;
  owner_id: string;
  owner_nickname: string | null;
  is_public: boolean;
  category: string | null;
  created_at: string;
  member_count: number;
  active_member_count: number;
  lifecycle_state: GroupLifecycleState;
  deletion_scheduled_at: string | null;
  current_season_id: string | null;
  current_season_number: number | null;
  current_season_status: string | null;
  current_season_ends_at: string | null;
  total_markets: number;
  total_bets: number;
  total_tokens_wagered: number;
}

export async function getGroupDetail(groupId: string): Promise<ActionResult<GroupDetail>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_group_detail', { p_group_id: groupId }).single();
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: data as GroupDetail };
}

export interface GroupRosterRow {
  membership_id: string;
  user_id: string;
  nickname: string;
  role: string;
  status: string;
  joined_at: string;
  balance: number;
  bets_placed: number;
  markets_created: number;
  last_bet_at: string | null;
}

export async function getGroupRoster(groupId: string): Promise<ActionResult<GroupRosterRow[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_group_roster', { p_group_id: groupId });
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as GroupRosterRow[] };
}

export interface GroupActivityDay {
  day: string;
  markets_created: number;
  bets_placed: number;
  members_joined: number;
}

export async function getGroupActivityTimeline(groupId: string, days = 90): Promise<ActionResult<GroupActivityDay[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_group_activity_timeline', { p_group_id: groupId, p_days: days });
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as GroupActivityDay[] };
}

export interface GroupSeasonHistoryRow {
  season_id: string;
  number: number;
  status: string;
  started_at: string | null;
  ended_at: string | null;
  season_length: string | null;
  snapshot: {
    champion?: { user_id: string; nickname: string; balance: number };
    loser?: { user_id: string; nickname: string; balance: number };
    markets_settled?: number;
    tokens_wagered?: number;
    bets_placed?: number;
  } | null;
}

export async function getGroupSeasonHistory(groupId: string): Promise<ActionResult<GroupSeasonHistoryRow[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_group_season_history', { p_group_id: groupId });
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as GroupSeasonHistoryRow[] };
}
