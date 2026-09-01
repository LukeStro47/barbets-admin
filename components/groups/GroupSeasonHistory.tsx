'use client';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { GroupSeasonHistoryRow } from '@/lib/actions/groupDetail';

/** Season-over-season trend read straight out of season_results.snapshot -- a rollup
 *  already computed once at season close, no new aggregation. Only started seasons
 *  with a snapshot (i.e. actually finished) plot on the trend line; the current
 *  in-progress season shows in the list below it but not on the chart. */
export function GroupSeasonHistory({ seasons }: { seasons: GroupSeasonHistoryRow[] }) {
  if (seasons.length === 0) {
    return <p className="text-sm text-espresso-400">No seasons yet.</p>;
  }

  const trend = seasons
    .filter((s) => s.snapshot)
    .map((s) => ({
      season: `#${s.number}`,
      'Tokens wagered': s.snapshot?.tokens_wagered ?? 0,
      'Bets placed': s.snapshot?.bets_placed ?? 0,
    }));

  return (
    <div className="flex flex-col gap-5">
      {trend.length > 1 && (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e4d8cc" strokeDasharray="3 3" />
              <XAxis dataKey="season" tick={{ fontSize: 11, fill: '#8c6f5c' }} axisLine={{ stroke: '#cbb6a2' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8c6f5c' }} axisLine={false} tickLine={false} allowDecimals={false} width={32} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e4d8cc', fontSize: 12 }} labelStyle={{ color: '#3b2a20', fontWeight: 600 }} />
              <Line type="monotone" dataKey="Tokens wagered" stroke="#2a78d6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {seasons
          .slice()
          .reverse()
          .map((s) => (
            <div key={s.season_id} className="flex items-center justify-between gap-4 rounded-xl border border-espresso-50 px-3.5 py-2.5">
              <div>
                <p className="text-[13.5px] font-bold text-espresso-900">
                  Season {s.number} <span className="font-normal text-espresso-400">&middot; {s.status}</span>
                </p>
                {s.snapshot?.champion && (
                  <p className="text-[12px] text-espresso-500">
                    Champion: {s.snapshot.champion.nickname} ({s.snapshot.champion.balance.toLocaleString('en-US')})
                  </p>
                )}
              </div>
              <div className="text-right text-[12px] text-espresso-500">
                {s.snapshot ? (
                  <>
                    {s.snapshot.markets_settled ?? 0} markets &middot; {s.snapshot.bets_placed ?? 0} bets &middot;{' '}
                    {(s.snapshot.tokens_wagered ?? 0).toLocaleString('en-US')} wagered
                  </>
                ) : (
                  'In progress'
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
