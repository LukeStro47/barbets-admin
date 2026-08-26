import { requireAdmin } from '@/lib/requireAdmin';
import { AdminNav } from '@/components/layout/AdminNav';
import { Card } from '@/components/ui/Card';
import { SignupsChart } from '@/components/growth/SignupsChart';
import { WauMauChart } from '@/components/growth/WauMauChart';
import { RetentionCohortGrid } from '@/components/growth/RetentionCohortGrid';
import { listSignupsPerDay, listWauMau, listRetentionCohorts, listLifecycleEventTotals } from '@/lib/actions/growth';

export default async function GrowthPage() {
  await requireAdmin();

  const [signups, wauMau, cohorts, eventTotals] = await Promise.all([
    listSignupsPerDay(90),
    listWauMau(26),
    listRetentionCohorts(12),
    listLifecycleEventTotals(30),
  ]);

  return (
    <>
      <AdminNav current="/growth" />
      <main className="mx-auto max-w-3xl space-y-6 px-5 py-8">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-espresso-950">Growth</h1>
          <p className="text-sm text-espresso-500">
            Signups read straight from account creation. Everything else here is counted from mutation-type activity (joining/creating
            a group, starting or ending a season, creating a market, placing a bet) logged since this tracking shipped — data before
            that date isn&apos;t reconstructed, and pure browsing sessions aren&apos;t counted, only these seven actions.
          </p>
        </div>

        <Card className="space-y-3">
          <h2 className="font-semibold text-espresso-800">Signups per day</h2>
          {signups.error ? <p className="text-sm text-danger-700">{signups.error}</p> : <SignupsChart data={signups.data ?? []} />}
        </Card>

        <Card className="space-y-3">
          <h2 className="font-semibold text-espresso-800">Weekly / monthly active users</h2>
          {wauMau.error ? <p className="text-sm text-danger-700">{wauMau.error}</p> : <WauMauChart data={wauMau.data ?? []} />}
        </Card>

        <Card className="space-y-3">
          <div>
            <h2 className="font-semibold text-espresso-800">Retention cohorts</h2>
            <p className="text-xs text-espresso-400">
              Each row is a signup week; each column is the percent of that cohort still active N weeks later.
            </p>
          </div>
          {cohorts.error ? <p className="text-sm text-danger-700">{cohorts.error}</p> : <RetentionCohortGrid rows={cohorts.data ?? []} />}
        </Card>

        <Card className="space-y-2">
          <h2 className="font-semibold text-espresso-800">Event totals, last 30 days</h2>
          <p className="text-xs text-espresso-400">A sanity check that instrumentation is actually firing, not a metric on its own.</p>
          {eventTotals.error ? (
            <p className="text-sm text-danger-700">{eventTotals.error}</p>
          ) : (eventTotals.data ?? []).length === 0 ? (
            <p className="text-sm text-espresso-400">No events logged yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(eventTotals.data ?? []).map((e) => (
                <div key={e.event_type} className="rounded-xl bg-espresso-50 px-3 py-2">
                  <p className="font-display text-lg font-bold text-espresso-900">{e.event_count}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-espresso-400">{e.event_type.replace('_', ' ')}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </>
  );
}
