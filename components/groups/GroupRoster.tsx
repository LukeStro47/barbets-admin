import type { GroupRosterRow } from '@/lib/actions/groupDetail';

function formatDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
}

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-success-100 text-success-700',
  dormant: 'bg-espresso-100 text-espresso-600',
  left: 'bg-espresso-50 text-espresso-400',
  removed: 'bg-danger-100 text-danger-700',
};

export function GroupRoster({ rows }: { rows: GroupRosterRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-espresso-400">No members.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-espresso-100 text-[11px] font-bold tracking-[0.1em] text-espresso-400 uppercase">
            <th className="py-2 pr-3">Member</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2 text-right">Balance</th>
            <th className="px-3 py-2 text-right">Bets</th>
            <th className="px-3 py-2 text-right">Markets</th>
            <th className="px-3 py-2 text-right">Joined</th>
            <th className="py-2 pl-3 text-right">Last bet</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.membership_id} className="border-b border-espresso-50 last:border-0">
              <td className="py-2.5 pr-3 font-bold text-espresso-900">
                {r.nickname}
                {r.role === 'moderator' && <span className="ml-1.5 text-[10.5px] font-bold text-honey-700 uppercase">Mod</span>}
              </td>
              <td className="px-3 py-2.5">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase ${STATUS_BADGE[r.status] ?? ''}`}>
                  {r.status}
                </span>
              </td>
              <td className="px-3 py-2.5 text-right text-espresso-600">{r.balance.toLocaleString('en-US')}</td>
              <td className="px-3 py-2.5 text-right text-espresso-600">{r.bets_placed}</td>
              <td className="px-3 py-2.5 text-right text-espresso-600">{r.markets_created}</td>
              <td className="px-3 py-2.5 text-right text-espresso-500">{formatDate(r.joined_at)}</td>
              <td className="py-2.5 pl-3 text-right text-espresso-500">{formatDate(r.last_bet_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
