'use client';

import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';
import type { GroupSizeEngagementRow } from '@/lib/actions/groups';

/** Single series, so no CVD-adjacent categorical choice needed here — one honey-500
 *  dot per group, member count vs. bets placed per member per week. */
export function GroupSizeEngagementScatter({ rows }: { rows: GroupSizeEngagementRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-espresso-400">No private groups yet.</p>;
  }

  const data = rows.map((r) => ({ x: r.member_count, y: r.bets_per_member_per_week, name: r.group_name }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#e4d8cc" strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="Members"
            tick={{ fontSize: 11, fill: '#8c6f5c' }}
            axisLine={{ stroke: '#cbb6a2' }}
            tickLine={false}
            allowDecimals={false}
            label={{ value: 'Members', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#8c6f5c' }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Bets / member / wk"
            tick={{ fontSize: 11, fill: '#8c6f5c' }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <ZAxis range={[60, 60]} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ borderRadius: 12, border: '1px solid #e4d8cc', fontSize: 12 }}
            labelStyle={{ color: '#3b2a20', fontWeight: 600 }}
            formatter={(value, key) => [key === 'y' ? Number(value).toFixed(2) : value, key === 'y' ? 'Bets / member / wk' : 'Members']}
            labelFormatter={() => ''}
          />
          <Scatter data={data} fill="#e8a33d" fillOpacity={0.75} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
