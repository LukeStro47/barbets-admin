import type { GroupLifecycleBenchmark, IntermissionConversion } from '@/lib/actions/groups';
import { GROUP_STATE_BADGE, GROUP_STATE_LABEL } from '@/lib/lifecycleLabels';
import { formatTokens } from '@/lib/formatNumber';

function fmt1(n: number | null): string {
  return n === null ? '—' : n.toFixed(1);
}

/** One card per lifecycle state actually present: what an average group in that state
 *  tangibly looks like, not just a headcount. Card order follows the enum's own
 *  top-down evaluation order (new -> active -> cooling -> stale -> winding_down ->
 *  intermission -> scheduled_for_deletion -> dormant), which already reads as a
 *  narrative rather than needing a second sort. */
export function LifecycleStateBoard({
  benchmarks,
  conversion,
}: {
  benchmarks: GroupLifecycleBenchmark[];
  conversion: IntermissionConversion | null;
}) {
  const withGroups = benchmarks.filter((b) => b.group_count > 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-3">
        {withGroups.map((b) => (
          <div key={b.lifecycle_state} className="flex flex-col gap-2.5 rounded-2xl border border-espresso-100 bg-paper-white p-[18px]">
            <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-[0.06em] uppercase ${GROUP_STATE_BADGE[b.lifecycle_state]}`}>
              {GROUP_STATE_LABEL[b.lifecycle_state]}
            </span>
            <p className="text-[28px] leading-none font-extrabold tracking-[-0.02em] text-espresso-950">{formatTokens(b.group_count)}</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-espresso-50 pt-2.5 text-[12px] text-espresso-500">
              <span>Members</span>
              <span className="text-right font-bold text-espresso-800">{fmt1(b.median_members)}</span>
              <span>Bets / wk</span>
              <span className="text-right font-bold text-espresso-800">{fmt1(b.median_bets_per_week)}</span>
              <span>Markets / wk</span>
              <span className="text-right font-bold text-espresso-800">{fmt1(b.median_markets_per_week)}</span>
              <span>Tenure (d)</span>
              <span className="text-right font-bold text-espresso-800">{fmt1(b.median_tenure_days)}</span>
              <span>Season</span>
              <span className="text-right font-bold text-espresso-800">{b.most_common_season_length ?? '—'}</span>
            </div>
          </div>
        ))}
      </div>

      {conversion && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-espresso-100 bg-paper-white p-[18px]">
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] text-espresso-400 uppercase">Intermission conversion, last 90 days</p>
            <p className="mt-1 text-[12.5px] text-espresso-500">
              {conversion.converted} of {conversion.total_intermissions} groups that entered intermission started a new season
              &middot; {conversion.still_intermission} still sitting there
            </p>
          </div>
          <p className="text-[34px] leading-none font-extrabold tracking-[-0.02em] text-espresso-950">
            {conversion.conversion_rate === null ? '—' : `${conversion.conversion_rate}%`}
          </p>
        </div>
      )}
    </div>
  );
}
