import type { ActivityMixRow } from '@/lib/actions/users';

const MIX_LABEL: Record<ActivityMixRow['mix_type'], string> = {
  bettor_only: 'Bets only',
  creator_or_sponsor: 'Creates/sponsors only',
  bettor_and_creator: 'Bets and creates',
  joiner_never_bets: 'Joined, never bet',
};

const MIX_ORDER: ActivityMixRow['mix_type'][] = ['bettor_and_creator', 'bettor_only', 'creator_or_sponsor', 'joiner_never_bets'];
const MIX_COLOR: Record<ActivityMixRow['mix_type'], string> = {
  bettor_and_creator: '#2a78d6',
  bettor_only: '#e8a33d',
  creator_or_sponsor: '#eb6834',
  joiner_never_bets: '#cbb6a2',
};

/** A simple proportional bar list rather than a pie -- four categories, no need for
 *  arc-angle comparison when a sorted bar list reads faster and needs no legend. */
export function ActivityMixChart({ rows }: { rows: ActivityMixRow[] }) {
  const byType = new Map(rows.map((r) => [r.mix_type, r.user_count]));
  const total = rows.reduce((sum, r) => sum + r.user_count, 0);

  if (total === 0) {
    return <p className="text-sm text-espresso-400">No active members in this window.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {MIX_ORDER.map((type) => {
        const count = byType.get(type) ?? 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={type} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between text-[12.5px]">
              <span className="font-bold text-espresso-800">{MIX_LABEL[type]}</span>
              <span className="text-espresso-400">
                {count} &middot; {pct}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-espresso-50">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: MIX_COLOR[type] }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
