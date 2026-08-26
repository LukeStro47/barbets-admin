'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { runRpc, toActionError, friendlyMessage, type ActionResult } from '@/lib/errors';

/** Ported from the main app's lib/actions/admin.ts — same RPC names and shapes, since this repo
 *  talks to the exact same Supabase project. Only the revalidatePath target changed, from '/admin'
 *  to this repo's own '/admin-tools' route. */

export interface AdminGroup {
  id: string;
  name: string;
  owner_id: string;
  invite_code: string;
  created_at: string;
  deletion_scheduled_at: string | null;
  avatar_key: string | null;
  is_public: boolean;
  category: 'generic' | 'campus' | null;
}

export async function sendAdminBroadcast(
  groupId: string,
  title: string,
  body: string,
  targetUserId: string | null
): Promise<ActionResult<null>> {
  const supabase = await createClient();
  return runRpc<null>(
    await supabase.rpc('send_admin_broadcast', { p_group_id: groupId, p_title: title, p_body: body, p_target_user_id: targetUserId })
  );
}

export interface CreatePublicGroupResult extends AdminGroup {
  unresolved_emails: string[];
}

export async function createPublicGroup(input: {
  name: string;
  category: 'generic' | 'campus';
  seedAmount: number;
  timezone: string;
  nickname?: string | null;
  moderatorEmails?: string[];
}): Promise<ActionResult<CreatePublicGroupResult>> {
  const supabase = await createClient();
  const result = await runRpc<CreatePublicGroupResult>(
    await supabase.rpc('create_public_group', {
      p_name: input.name,
      p_category: input.category,
      p_seed_amount: input.seedAmount,
      p_timezone: input.timezone,
      p_nickname: input.nickname ?? null,
      p_moderator_emails: input.moderatorEmails ?? [],
    })
  );
  if (result.error) return result;
  revalidatePath('/admin-tools');
  return result;
}

export interface ModeratorCandidate {
  user_id: string;
  nickname: string;
  role: 'member' | 'moderator';
}

export async function listGroupModeratorCandidates(groupId: string): Promise<ActionResult<ModeratorCandidate[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('list_group_moderator_candidates', { p_group_id: groupId });
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as ModeratorCandidate[] };
}

export async function assignGroupModerator(groupId: string, targetUserId: string, isModerator: boolean): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const result = await runRpc<null>(
    await supabase.rpc('assign_group_moderator', { p_group_id: groupId, p_target_user_id: targetUserId, p_is_moderator: isModerator })
  );
  if (result.error) return result;
  revalidatePath('/admin-tools');
  return result;
}

export interface PipelineSetting {
  pipeline: 'sports' | 'weather';
  enabled: boolean;
  updated_at: string;
}

export async function listPipelineSettings(): Promise<ActionResult<PipelineSetting[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('list_pipeline_settings');
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as PipelineSetting[] };
}

export async function setPipelineEnabled(pipeline: 'sports' | 'weather', enabled: boolean): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const result = await runRpc<null>(await supabase.rpc('set_pipeline_enabled', { p_pipeline: pipeline, p_enabled: enabled }));
  if (result.error) return result;
  revalidatePath('/admin-tools');
  return result;
}

export interface PipelineHealth {
  pipeline: 'sports' | 'weather';
  job: 'create' | 'resolve';
  last_run_at: string | null;
  last_run_succeeded: number | null;
  last_run_failed: number | null;
  open_failure_count: number;
  last_failure_at: string | null;
  last_failure_message: string | null;
}

export async function listPipelineHealth(): Promise<ActionResult<PipelineHealth[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('list_pipeline_health');
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as PipelineHealth[] };
}

export interface QrScanTotal {
  batch: string;
  total_count: number;
  android_count: number;
  ios_count: number;
  other_count: number;
  first_scanned_at: string;
  last_scanned_at: string;
}

export async function listQrScanTotals(): Promise<ActionResult<QrScanTotal[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('list_qr_scan_totals');
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as QrScanTotal[] };
}

export interface GroupOption {
  id: string;
  name: string;
  member_count: number;
}

export async function listGroupsForAdmin(): Promise<ActionResult<GroupOption[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('list_groups_for_admin');
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as GroupOption[] };
}

export interface GroupMember {
  group_id: string;
  user_id: string;
  nickname: string;
}

export async function listGroupMembersForAdmin(): Promise<ActionResult<GroupMember[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('list_group_members_for_admin');
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as GroupMember[] };
}

export interface PublicGroup {
  id: string;
  name: string;
  avatar_key: string | null;
  category: 'generic' | 'campus';
  member_count: number;
}

export async function listPublicGroups(): Promise<ActionResult<PublicGroup[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('list_public_groups');
  if (error) return { error: friendlyMessage(toActionError(error)) };
  return { data: (data ?? []) as PublicGroup[] };
}

export interface PlatformStats {
  active_groups: number;
  total_markets: number;
  total_users: number;
}

export async function getPlatformAdminStats(): Promise<ActionResult<PlatformStats>> {
  const supabase = await createClient();
  return runRpc<PlatformStats>(await supabase.rpc('get_platform_admin_stats'));
}
