'use client';

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { WauMauWeek } from '@/lib/actions/growth';

function formatWeek(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Two series (WAU, MAU) sharing one chart, so identity has to survive color-vision deficiency —
 *  these are categorical slots 1 (blue) and 2 (orange) from the dataviz skill's validated default
 *  palette (fixed order, worst adjacent CVD deltaE 9.1 light / 8.4 dark, both clear the >=8
 *  target), not picked for brand match. A legend is mandatory at 2+ series regardless of how
 *  distinct the lines look on a full-color screen. */
export function WauMauChart({ data }: { data: WauMauWeek[] }) {
  const chartData = data.map((d) => ({ week: formatWeek(d.period_start), WAU: d.wau, MAU: d.mau }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e4d8cc" strokeDasharray="3 3" />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fill: '#8c6f5c' }}
            axisLine={{ stroke: '#cbb6a2' }}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis tick={{ fontSize: 11, fill: '#8c6f5c' }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e4d8cc', fontSize: 12 }} labelStyle={{ color: '#3b2a20', fontWeight: 600 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="plainline" />
          <Line type="monotone" dataKey="WAU" stroke="#2a78d6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="MAU" stroke="#eb6834" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
