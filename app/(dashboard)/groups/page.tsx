import { requireAdmin } from '@/lib/requireAdmin';
import { Card, CardHeader } from '@/components/ui/Card';
import { LifecycleStateBoard } from '@/components/groups/LifecycleStateBoard';
import { GroupsTable } from '@/components/groups/GroupsTable';
import { GroupSizeEngagementScatter } from '@/components/groups/GroupSizeEngagementScatter';
import { GroupRetentionCohortGrid } from '@/components/groups/GroupRetentionCohortGrid';
import {
  listGroupLifecycleStates,
  listGroupLifecycleBenchmarks,
  getIntermissionConversion,
  listGroupCohortRetention,
  listGroupSizeEngagement,
} from '@/lib/actions/groups';

export default async function GroupsPage() {
  await requireAdmin();

  const [states, benchmarks, conversion, cohorts, sizeEngagement] = await Promise.all([
    listGroupLifecycleStates(),
    listGroupLifecycleBenchmarks(),
    getIntermissionConversion(90),
    listGroupCohortRetention(12),
    listGroupSizeEngagement(),
  ]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-[34px] font-extrabold tracking-[-0.03em] text-espresso-950">Groups</h1>
        <p className="max-w-[900px] text-[13.5px] leading-[1.6] text-espresso-500">
          Private groups only &mdash; Sports, Weather, and other public groups are pipeline-driven or directory-joined, not a signal of
          whether a real friend group is still coming back. &quot;Active&quot; here matches the same 14-day market-and-bet rule the
          Overview page uses; Cooling and Stale extend it into a 15-90 day trailing read instead of stopping at a binary yes/no.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">Lifecycle states</h2>
          <p className="mt-[3px] text-[12.5px] text-espresso-400">What an average group in each state actually looks like.</p>
        </CardHeader>
        {states.error || benchmarks.error ? (
          <p className="text-sm text-danger-700">{states.error ?? benchmarks.error}</p>
        ) : (
          <LifecycleStateBoard benchmarks={benchmarks.data ?? []} conversion={conversion.data ?? null} />
        )}
      </Card>

      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <h2 className="text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">Size vs. engagement</h2>
            <p className="mt-[3px] text-[12.5px] text-espresso-400">Each dot is one group: member count vs. bets per member per week.</p>
          </CardHeader>
          {sizeEngagement.error ? (
            <p className="text-sm text-danger-700">{sizeEngagement.error}</p>
          ) : (
            <GroupSizeEngagementScatter rows={sizeEngagement.data ?? []} />
          )}
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">Group retention cohorts</h2>
            <p className="mt-[3px] text-[12.5px] text-espresso-400">
              Each row is a group-creation week; each column is the percent still active N weeks later.
            </p>
          </CardHeader>
          {cohorts.error ? <p className="text-sm text-danger-700">{cohorts.error}</p> : <GroupRetentionCohortGrid rows={cohorts.data ?? []} />}
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">All private groups</h2>
        </CardHeader>
        {states.error ? <p className="text-sm text-danger-700">{states.error}</p> : <GroupsTable rows={states.data ?? []} />}
      </Card>
    </>
  );
}
