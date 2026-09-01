import { requireAdmin } from '@/lib/requireAdmin';
import { Card, CardHeader } from '@/components/ui/Card';
import { UserSegmentBoard } from '@/components/users/UserSegmentBoard';
import { ActivityMixChart } from '@/components/users/ActivityMixChart';
import { MultiGroupHistogram } from '@/components/users/MultiGroupHistogram';
import { MembershipChurnCard } from '@/components/users/MembershipChurnCard';
import { listUserSegments, listUserActivityMix, listUserMultiGroupDistribution, getMembershipChurn } from '@/lib/actions/users';

export default async function UsersPage() {
  await requireAdmin();

  const [segments, mix, multiGroup, churn] = await Promise.all([
    listUserSegments(),
    listUserActivityMix(90),
    listUserMultiGroupDistribution(),
    getMembershipChurn(180),
  ]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-[34px] font-extrabold tracking-[-0.03em] text-espresso-950">Users</h1>
        <p className="max-w-[900px] text-[13.5px] leading-[1.6] text-espresso-500">
          Segments reuse the same 7/30/90-day windows as the Growth page&apos;s WAU/MAU and the inactivity deletion sweep. The
          3-bets/week Power cutoff is the one genuinely new number here &mdash; treat it as a starting point, not a settled line.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">Engagement segments</h2>
        </CardHeader>
        {segments.error ? <p className="text-sm text-danger-700">{segments.error}</p> : <UserSegmentBoard segments={segments.data ?? []} />}
      </Card>

      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <h2 className="text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">Activity mix, last 90 days</h2>
            <p className="mt-[3px] text-[12.5px] text-espresso-400">Among currently active/dormant members.</p>
          </CardHeader>
          {mix.error ? <p className="text-sm text-danger-700">{mix.error}</p> : <ActivityMixChart rows={mix.data ?? []} />}
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">Groups per user</h2>
          </CardHeader>
          {multiGroup.error ? <p className="text-sm text-danger-700">{multiGroup.error}</p> : <MultiGroupHistogram buckets={multiGroup.data ?? []} />}
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">Membership churn, last 180 days</h2>
          <p className="mt-[3px] text-[12.5px] text-espresso-400">Early (within 7 days of joining) vs. late churn, by join cohort.</p>
        </CardHeader>
        {churn.error ? <p className="text-sm text-danger-700">{churn.error}</p> : churn.data ? <MembershipChurnCard churn={churn.data} /> : null}
      </Card>
    </>
  );
}
