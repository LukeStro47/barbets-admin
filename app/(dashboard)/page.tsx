import Link from 'next/link';
import { requireAdmin } from '@/lib/requireAdmin';
import { formatTokens } from '@/lib/formatNumber';
import { formatAgo } from '@/lib/pipelineStatus';
import { Card, CardHeader } from '@/components/ui/Card';
import { AlertTriangleIcon, ClockIcon, ShieldAlertIcon } from '@/components/ui/icons';
import type { ModeratorCandidate, PipelineHealth, PublicGroup } from '@/lib/actions/admin-tools';

interface PlatformStats {
  active_groups: number;
  total_markets: number;
  total_users: number;
}

interface WauMauRow {
  period_start: string;
  wau: number;
  mau: number;
}

interface GroupStats {
  active_private_groups: number;
  total_private_groups: number;
  scheduled_for_deletion: number;
  deleted_last_30d: number;
}

const PIPELINE_LABEL: Record<PipelineHealth['pipeline'], string> = { sports: 'Sports', weather: 'Weather' };
const JOB_LABEL: Record<PipelineHealth['job'], string> = { create: 'Create', resolve: 'Resolve' };

export default async function OverviewPage() {
  const { supabase } = await requireAdmin();

  const [{ data: stats }, { data: wauMau }, { data: groupStats }, { data: pipelineHealth }, { data: publicGroups }] = await Promise.all([
    supabase.rpc('get_platform_admin_stats').single(),
    supabase.rpc('admin_wau_mau', { p_weeks: 1 }),
    supabase.rpc('admin_group_stats').single(),
    supabase.rpc('list_pipeline_health'),
    supabase.rpc('list_public_groups'),
  ]);

  const platformStats = stats as PlatformStats | null;
  const thisWeek = ((wauMau as WauMauRow[] | null) ?? [])[0] ?? null;
  const groups = groupStats as GroupStats | null;
  const failingJobs = ((pipelineHealth as PipelineHealth[] | null) ?? []).filter((j) => j.open_failure_count > 0);

  const groupsToCheck = (publicGroups as PublicGroup[] | null) ?? [];
  const moderatorChecks = await Promise.all(
    groupsToCheck.map((g) => supabase.rpc('list_group_moderator_candidates', { p_group_id: g.id }))
  );
  const unmoderatedGroups = groupsToCheck.filter((_, i) => {
    const candidates = (moderatorChecks[i].data as ModeratorCandidate[] | null) ?? [];
    return !candidates.some((c) => c.role === 'moderator');
  });

  const totalActive = groups?.active_private_groups ?? 0;
  const totalPrivate = groups?.total_private_groups ?? 0;
  const filledTicks = totalPrivate > 0 ? Math.round((totalActive / totalPrivate) * 30) : 0;

  const timestamp = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date());
  const dateLabel = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date());

  const hasAttention = failingJobs.length > 0 || (groups?.scheduled_for_deletion ?? 0) > 0 || unmoderatedGroups.length > 0;

  return (
    <>
      <div className="flex items-end justify-between gap-6">
        <h1 className="text-[34px] font-extrabold tracking-[-0.03em] text-espresso-950">Overview</h1>
        <span className="text-[12.5px] text-espresso-400">
          as of {timestamp} ET &middot; {dateLabel}
        </span>
      </div>

      <div className="overflow-hidden rounded-[22px] bg-[linear-gradient(158deg,#3b2a20_0%,#1c130d_100%)] px-8 pt-7 shadow-[0_14px_30px_-18px_rgba(28,19,13,0.55)]">
        <div className="flex items-center gap-2.5 pb-5">
          <span className="h-2 w-2 rounded-full bg-honey-500" />
          <span className="text-[11px] font-bold tracking-[0.16em] text-honey-500 uppercase">Platform, live</span>
        </div>
        <div className="grid grid-cols-4 pb-[26px]">
          <div className="pr-6">
            <p className="text-[48px] leading-none font-extrabold tracking-[-0.035em] text-paper-white">
              {formatTokens(platformStats?.active_groups ?? 0)}
            </p>
            <p className="mt-2 text-[11px] font-bold tracking-[0.14em] text-espresso-300 uppercase">Total groups</p>
          </div>
          <div className="border-l border-dashed border-[rgba(232,163,61,0.3)] px-6">
            <p className="text-[48px] leading-none font-extrabold tracking-[-0.035em] text-paper-white">{formatTokens(totalActive)}</p>
            <p className="mt-2 text-[11px] font-bold tracking-[0.14em] text-espresso-300 uppercase">Active groups</p>
          </div>
          <div className="border-l border-dashed border-[rgba(232,163,61,0.3)] px-6">
            <p className="text-[48px] leading-none font-extrabold tracking-[-0.035em] text-paper-white">
              {formatTokens(platformStats?.total_markets ?? 0)}
            </p>
            <p className="mt-2 text-[11px] font-bold tracking-[0.14em] text-espresso-300 uppercase">Markets</p>
          </div>
          <div className="border-l border-dashed border-[rgba(232,163,61,0.3)] pl-6">
            <p className="text-[48px] leading-none font-extrabold tracking-[-0.035em] text-paper-white">
              {formatTokens(platformStats?.total_users ?? 0)}
            </p>
            <p className="mt-2 text-[11px] font-bold tracking-[0.14em] text-espresso-300 uppercase">Users</p>
          </div>
        </div>
        <div className="relative -mx-8 flex items-center justify-between gap-4 border-t border-dashed border-[rgba(232,163,61,0.35)] px-8 py-3.5">
          <span className="absolute top-[-9px] left-[-9px] h-[18px] w-[18px] rounded-full bg-paper" />
          <span className="absolute top-[-9px] right-[-9px] h-[18px] w-[18px] rounded-full bg-paper" />
          <p className="text-[12.5px] text-espresso-300">
            {groups?.scheduled_for_deletion ?? 0} group{groups?.scheduled_for_deletion === 1 ? '' : 's'} scheduled for deletion &middot;{' '}
            {groups?.deleted_last_30d ?? 0} deleted in the last 30 days
          </p>
          <Link href="/admin-tools#groups" className="text-[12.5px] font-bold text-honey-400">
            Review deletions &rarr;
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-[1.1fr_1fr] items-start gap-5">
        <Card>
          <CardHeader className="flex items-center justify-between gap-3">
            <h2 className="text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">This week</h2>
            <Link href="/growth" className="text-[13px] font-bold text-honey-700">
              Full growth dashboard &rarr;
            </Link>
          </CardHeader>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-[38px] leading-none font-extrabold tracking-[-0.03em] text-espresso-950">{formatTokens(thisWeek?.wau ?? 0)}</p>
              <p className="mt-1.5 text-xs font-bold tracking-[0.1em] text-espresso-400 uppercase">Weekly active</p>
            </div>
            <div>
              <p className="text-[38px] leading-none font-extrabold tracking-[-0.03em] text-espresso-950">{formatTokens(thisWeek?.mau ?? 0)}</p>
              <p className="mt-1.5 text-xs font-bold tracking-[0.1em] text-espresso-400 uppercase">Monthly active</p>
            </div>
          </div>
          <p className="text-[12.5px] leading-[1.55] text-espresso-400">
            Counted from mutation-type activity (joining/creating a group, starting or ending a season, creating a market, placing a
            bet) since this tracking shipped, not a full page-view log, so pure browsing sessions aren&apos;t counted here.
          </p>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">Private group engagement</h2>
          </CardHeader>
          <div className="flex items-baseline gap-2">
            <p className="text-[38px] leading-none font-extrabold tracking-[-0.03em] text-espresso-950">{formatTokens(totalActive)}</p>
            <p className="text-lg font-bold text-espresso-300">/ {formatTokens(totalPrivate)} active</p>
          </div>
          <div className="flex gap-[3px]">
            {Array.from({ length: 30 }, (_, i) => (
              <span key={i} className={`h-[22px] flex-1 rounded-[3px] ${i < filledTicks ? 'bg-honey-500' : 'bg-espresso-50'}`} />
            ))}
          </div>
          <p className="text-[12.5px] leading-[1.55] text-espresso-400">
            &quot;Active&quot; means at least one market created and at least one bet placed in the same group in the last 14 days.
            Scoped to private groups only, Sports, Weather, and campus groups are pipeline-driven or directory-joined, not a signal of
            whether a real friend group is still coming back.
          </p>
        </Card>
      </div>

      {hasAttention && (
        <div className="grid grid-cols-3 gap-3">
          {failingJobs.map((j) => (
            <div key={`${j.pipeline}-${j.job}`} className="flex flex-col gap-2.5 rounded-2xl border border-danger-100 bg-paper-white p-[18px]">
              <span className="flex items-center gap-2 text-[11px] font-bold tracking-[0.12em] text-danger-700 uppercase">
                <AlertTriangleIcon className="h-3.5 w-3.5" />
                Failing
              </span>
              <p className="text-[15px] leading-[1.35] font-bold text-espresso-950">
                {PIPELINE_LABEL[j.pipeline]} {JOB_LABEL[j.job]} job has {j.open_failure_count} stuck failure
                {j.open_failure_count === 1 ? '' : 's'}
              </p>
              <p className="text-[12.5px] text-espresso-400">
                {j.last_run_at ? formatAgo(j.last_run_at) : 'no runs yet'}: {j.last_run_succeeded ?? 0} ok, {j.last_run_failed ?? 0} failed
                {j.last_failure_message ? `, ${j.last_failure_message}` : ''}
              </p>
              <Link href="/admin-tools#pipelines" className="text-[12.5px] font-bold text-honey-700">
                Open pipelines &rarr;
              </Link>
            </div>
          ))}

          {(groups?.scheduled_for_deletion ?? 0) > 0 && (
            <div className="flex flex-col gap-2.5 rounded-2xl border border-honey-200 bg-paper-white p-[18px]">
              <span className="flex items-center gap-2 text-[11px] font-bold tracking-[0.12em] text-honey-800 uppercase">
                <ClockIcon className="h-3.5 w-3.5" />
                Expiring
              </span>
              <p className="text-[15px] leading-[1.35] font-bold text-espresso-950">
                {groups?.scheduled_for_deletion} group{groups?.scheduled_for_deletion === 1 ? '' : 's'} scheduled for deletion
              </p>
              <p className="text-[12.5px] text-espresso-400">Deleted for good on schedule unless the owner restores it first.</p>
              <Link href="/admin-tools#groups" className="text-[12.5px] font-bold text-honey-700">
                Review &rarr;
              </Link>
            </div>
          )}

          {unmoderatedGroups.map((g) => (
            <div key={g.id} className="flex flex-col gap-2.5 rounded-2xl border border-espresso-100 bg-paper-white p-[18px]">
              <span className="flex items-center gap-2 text-[11px] font-bold tracking-[0.12em] text-espresso-600 uppercase">
                <ShieldAlertIcon className="h-3.5 w-3.5" />
                Unmoderated
              </span>
              <p className="text-[15px] leading-[1.35] font-bold text-espresso-950">{g.name} has no moderator</p>
              <p className="text-[12.5px] text-espresso-400">
                {g.member_count} member{g.member_count === 1 ? '' : 's'}
              </p>
              <Link href="/admin-tools#groups" className="text-[12.5px] font-bold text-honey-700">
                Assign &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
