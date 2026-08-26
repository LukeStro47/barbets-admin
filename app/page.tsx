import Link from 'next/link';
import { requireAdmin } from '@/lib/requireAdmin';
import { AdminNav } from '@/components/layout/AdminNav';
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

export default async function OverviewPage() {
  const { supabase } = await requireAdmin();

  const [{ data: stats }, { data: wauMau }] = await Promise.all([
    supabase.rpc('get_platform_admin_stats').single(),
    supabase.rpc('admin_wau_mau', { p_weeks: 1 }),
  ]);

  const platformStats = stats as PlatformStats | null;
  const thisWeek = ((wauMau as WauMauRow[] | null) ?? [])[0] ?? null;

  return (
    <>
      <AdminNav current="/" />
      <main className="mx-auto max-w-lg space-y-6 px-5 py-8">
        <h1 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-espresso-950">Overview</h1>

        <div className="grid grid-cols-3 gap-3">
          <StatTile label="Active groups" value={platformStats?.active_groups ?? 0} />
          <StatTile label="Markets" value={platformStats?.total_markets ?? 0} />
          <StatTile label="Users" value={platformStats?.total_users ?? 0} />
        </div>

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
      </main>
    </>
  );
}
