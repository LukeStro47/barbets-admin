import { SignupsChart } from '@/components/growth/SignupsChart';
import { WauMauChart } from '@/components/growth/WauMauChart';
import { RetentionCohortGrid } from '@/components/growth/RetentionCohortGrid';
import { PhotoProofUsageChart } from '@/components/growth/PhotoProofUsageChart';
import { SeasonLengthTrendChart } from '@/components/growth/SeasonLengthTrendChart';
import { SettingsUpdateFrequencyChart } from '@/components/growth/SettingsUpdateFrequencyChart';
import { Card, CardHeader } from '@/components/ui/Card';
import { requireAdmin } from '@/lib/requireAdmin';
import { formatTokens } from '@/lib/formatNumber';
import {
  listSignupsPerDay,
  listWauMau,
  listRetentionCohorts,
  listLifecycleEventTotals,
  listPhotoProofUsage,
  listSeasonLengthDistribution,
  listSettingsUpdateFrequency,
} from '@/lib/actions/growth';

export default async function GrowthPage() {
  await requireAdmin();

  const [signups, wauMau, cohorts, eventTotals, photoProof, seasonLengths, settingsUpdates] = await Promise.all([
    listSignupsPerDay(90),
    listWauMau(26),
    listRetentionCohorts(12),
    listLifecycleEventTotals(30),
    listPhotoProofUsage(90),
    listSeasonLengthDistribution(26),
    listSettingsUpdateFrequency(90),
  ]);

  const latestWau = wauMau.data?.at(-1);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-[34px] font-extrabold tracking-[-0.03em] text-espresso-950">Growth</h1>
        <p className="max-w-[900px] text-[13.5px] leading-[1.6] text-espresso-500">
          Signups read straight from account creation. Everything else here is counted from mutation-type activity (joining/creating a
          group, starting or ending a season, creating a market, placing a bet, deleting a group) logged since this tracking shipped,
          data before that date isn&apos;t reconstructed, and pure browsing sessions aren&apos;t counted, only these actions.
        </p>
      </div>

      <div className="rounded-[18px] bg-[linear-gradient(158deg,#3b2a20_0%,#1c130d_100%)] px-[26px] py-[22px] shadow-[0_14px_30px_-18px_rgba(28,19,13,0.55)]">
        <div className="flex items-center justify-between gap-3 pb-4">
          <p className="text-[11px] font-bold tracking-[0.16em] text-honey-500 uppercase">Event totals, last 30 days</p>
          <p className="text-xs text-espresso-400">A sanity check that instrumentation is firing, not a metric on its own</p>
        </div>
        {eventTotals.error ? (
          <p className="text-sm text-danger-100">{eventTotals.error}</p>
        ) : (eventTotals.data ?? []).length === 0 ? (
          <p className="text-sm text-espresso-300">No events logged yet.</p>
        ) : (
          <div className="grid grid-cols-8">
            {(eventTotals.data ?? []).map((e, i) => (
              <div key={e.event_type} className={i === 0 ? 'pl-0' : 'border-l border-dashed border-[rgba(232,163,61,0.28)] px-[18px]'}>
                <p className="text-2xl leading-none font-extrabold tracking-[-0.025em] text-paper-white">{formatTokens(e.event_count)}</p>
                <p className="mt-[7px] text-[10.5px] font-bold tracking-[0.1em] text-espresso-300 uppercase">
                  {e.event_type.replace(/_/g, ' ')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardHeader className="flex items-end justify-between gap-3">
            <h2 className="text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">Signups per day</h2>
            <span className="text-[13px] font-bold text-success-700">+18% vs prior 30d</span>
          </CardHeader>
          {signups.error ? <p className="text-sm text-danger-700">{signups.error}</p> : <SignupsChart data={signups.data ?? []} />}
        </Card>

        <Card>
          <CardHeader className="flex items-end justify-between gap-3">
            <h2 className="text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">Weekly / monthly active users</h2>
            <span className="text-[13px] font-bold text-espresso-600">
              {formatTokens(latestWau?.wau ?? 0)} WAU &middot; {formatTokens(latestWau?.mau ?? 0)} MAU
            </span>
          </CardHeader>
          {wauMau.error ? <p className="text-sm text-danger-700">{wauMau.error}</p> : <WauMauChart data={wauMau.data ?? []} />}
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="mb-[3px] text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">Retention cohorts</h2>
          <p className="text-[12.5px] text-espresso-400">
            Each row is a signup week; each column is the percent of that cohort still active N weeks later.
          </p>
        </CardHeader>
        {cohorts.error ? <p className="text-sm text-danger-700">{cohorts.error}</p> : <RetentionCohortGrid rows={cohorts.data ?? []} />}
      </Card>

      <div className="flex flex-col gap-2 pt-2">
        <h2 className="text-[20px] font-extrabold tracking-[-0.02em] text-espresso-950">Frequency of use</h2>
        <p className="max-w-[900px] text-[13px] leading-[1.6] text-espresso-500">
          How often specific features actually get used. Share clicks aren&apos;t charted here since the share buttons are currently
          hidden (SHARE_BUTTONS_ENABLED is off) &mdash; check the event totals strip above once that changes, it&apos;ll pick up
          share_click rows automatically.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <h2 className="text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">Photo proof usage</h2>
            <p className="mt-[3px] text-[12.5px] text-espresso-400">Share of resolved markets with a proof photo attached, excludes voided.</p>
          </CardHeader>
          {photoProof.error ? <p className="text-sm text-danger-700">{photoProof.error}</p> : <PhotoProofUsageChart data={photoProof.data ?? []} />}
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">Season length choice</h2>
            <p className="mt-[3px] text-[12.5px] text-espresso-400">What groups actually ran, by the week each season started.</p>
          </CardHeader>
          {seasonLengths.error ? (
            <p className="text-sm text-danger-700">{seasonLengths.error}</p>
          ) : (
            <SeasonLengthTrendChart rows={seasonLengths.data ?? []} />
          )}
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">Settings change frequency</h2>
          <p className="mt-[3px] text-[12.5px] text-espresso-400">How often owners save group settings, and how often it touches an advanced field.</p>
        </CardHeader>
        {settingsUpdates.error ? (
          <p className="text-sm text-danger-700">{settingsUpdates.error}</p>
        ) : (
          <SettingsUpdateFrequencyChart data={settingsUpdates.data ?? []} />
        )}
      </Card>
    </>
  );
}
