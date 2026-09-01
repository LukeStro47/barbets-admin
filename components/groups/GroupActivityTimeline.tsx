'use client';

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { GroupActivityDay } from '@/lib/actions/groupDetail';

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Two series (markets, bets) sharing one chart — same fixed categorical slots
 *  (blue/orange) as WauMauChart, kept consistent across the whole admin panel rather
 *  than re-picked per chart. */
export function GroupActivityTimeline({ days }: { days: GroupActivityDay[] }) {
  const data = days.map((d) => ({ day: formatDay(d.day), Markets: d.markets_created, Bets: d.bets_placed }));

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e4d8cc" strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8c6f5c' }} axisLine={{ stroke: '#cbb6a2' }} tickLine={false} minTickGap={28} />
          <YAxis tick={{ fontSize: 11, fill: '#8c6f5c' }} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e4d8cc', fontSize: 12 }} labelStyle={{ color: '#3b2a20', fontWeight: 600 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="plainline" />
          <Area type="monotone" dataKey="Markets" stroke="#2a78d6" fill="#2a78d6" fillOpacity={0.12} strokeWidth={2} />
          <Area type="monotone" dataKey="Bets" stroke="#eb6834" fill="#eb6834" fillOpacity={0.12} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
