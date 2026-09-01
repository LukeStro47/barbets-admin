import type { UserSegmentRow } from '@/lib/actions/users';
import { USER_SEGMENT_BADGE, USER_SEGMENT_LABEL } from '@/lib/lifecycleLabels';
import { formatTokens } from '@/lib/formatNumber';

function fmt1(n: number | null): string {
  return n === null ? '—' : n.toFixed(1);
}

export function UserSegmentBoard({ segments }: { segments: UserSegmentRow[] }) {
  const withUsers = segments.filter((s) => s.user_count > 0);

  if (withUsers.length === 0) {
    return <p className="text-sm text-espresso-400">No users yet.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {withUsers.map((s) => (
        <div key={s.segment} className="flex flex-col gap-2.5 rounded-2xl border border-espresso-100 bg-paper-white p-[18px]">
          <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-[0.06em] uppercase ${USER_SEGMENT_BADGE[s.segment]}`}>
            {USER_SEGMENT_LABEL[s.segment]}
          </span>
          <div className="flex items-baseline gap-2">
            <p className="text-[28px] leading-none font-extrabold tracking-[-0.02em] text-espresso-950">{formatTokens(s.user_count)}</p>
            <p className="text-[13px] font-bold text-espresso-300">{s.pct_of_total ?? 0}%</p>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-espresso-50 pt-2.5 text-[12px] text-espresso-500">
            <span>Bets / wk</span>
            <span className="text-right font-bold text-espresso-800">{fmt1(s.median_bets_per_week)}</span>
            <span>Groups</span>
            <span className="text-right font-bold text-espresso-800">{fmt1(s.median_active_memberships)}</span>
            <span>Tenure (d)</span>
            <span className="text-right font-bold text-espresso-800">{fmt1(s.median_tenure_days)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
