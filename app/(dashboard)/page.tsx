import Link from 'next/link';
import { requireAdmin } from '@/lib/requireAdmin';
import { Card } from '@/components/ui/Card';
import { StatTile } from '@/components/ui/StatTile';

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

export default async function OverviewPage() {
  const { supabase } = await requireAdmin();

  const [{ data: stats }, { data: wauMau }, { data: groupStats }] = await Promise.all([
    supabase.rpc('get_platform_admin_stats').single(),
    supabase.rpc('admin_wau_mau', { p_weeks: 1 }),
    supabase.rpc('admin_group_stats').single(),
  ]);

  const platformStats = stats as PlatformStats | null;
  const thisWeek = ((wauMau as WauMauRow[] | null) ?? [])[0] ?? null;
  const groups = groupStats as GroupStats | null;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-espresso-950">Overview</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* "Total groups" is get_platform_admin_stats().active_groups under the hood -- it just
            means "not scheduled for deletion," public and private alike. Labeled distinctly from
            the "Active groups" tile below so the two aren't mistaken for the same claim. */}
        <StatTile label="Total groups" value={platformStats?.active_groups ?? 0} />
        <StatTile label="Active groups" value={groups?.active_private_groups ?? 0} />
        <StatTile label="Markets" value={platformStats?.total_markets ?? 0} />
        <StatTile label="Users" value={platformStats?.total_users ?? 0} />
      </div>

      <p className="text-xs text-espresso-400">
        {groups?.scheduled_for_deletion ?? 0} group{groups?.scheduled_for_deletion === 1 ? '' : 's'} scheduled for deletion &middot;{' '}
        {groups?.deleted_last_30d ?? 0} deleted in the last 30 days
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-espresso-800">This week</h2>
            <Link href="/growth" className="text-xs font-semibold text-honey-700">
              Full growth dashboard →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-display text-2xl font-bold text-espresso-900">{thisWeek?.wau ?? 0}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-espresso-400">Weekly active</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-espresso-900">{thisWeek?.mau ?? 0}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-espresso-400">Monthly active</p>
            </div>
          </div>
          <p className="text-xs text-espresso-400">
            Counted from mutation-type activity (joining/creating a group, starting or ending a season, creating a market, placing a
            bet) since this tracking shipped — not a full page-view log, so pure browsing sessions aren&apos;t counted here.
          </p>
        </Card>

        <Card className="space-y-2">
          <h2 className="font-semibold text-espresso-800">Private group engagement</h2>
          <div>
            <p className="font-display text-2xl font-bold text-espresso-900">
              {groups?.active_private_groups ?? 0} <span className="text-base font-semibold text-espresso-400">/ {groups?.total_private_groups ?? 0}</span>
            </p>
            <p className="text-xs font-semibold uppercase tracking-wide text-espresso-400">Active private groups</p>
          </div>
          <p className="text-xs text-espresso-400">
            "Active" means at least one market created and at least one bet placed in the same group in the last 14 days. Scoped to
            private groups only — Sports, Weather, and campus groups are pipeline-driven or directory-joined, not a signal of whether a
            real friend group is still coming back.
          </p>
        </Card>
      </div>
    </div>
  );
}
