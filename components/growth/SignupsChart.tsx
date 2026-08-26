'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { SignupDay } from '@/lib/actions/growth';

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Single series, so no categorical-identity concern (color choice here is just brand, not a
 *  CVD-safety decision — that only matters once a chart needs to tell two-plus series apart). */
export function SignupsChart({ data }: { data: SignupDay[] }) {
  const chartData = data.map((d) => ({ day: formatDay(d.day), signups: d.signups }));

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e4d8cc" strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: '#8c6f5c' }}
            axisLine={{ stroke: '#cbb6a2' }}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis tick={{ fontSize: 11, fill: '#8c6f5c' }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
          <Tooltip
            cursor={{ fill: '#f2eae1' }}
            contentStyle={{ borderRadius: 12, border: '1px solid #e4d8cc', fontSize: 12 }}
            labelStyle={{ color: '#3b2a20', fontWeight: 600 }}
            formatter={(value) => [value, 'Signups']}
          />
          <Bar dataKey="signups" fill="#e8a33d" radius={[3, 3, 0, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
