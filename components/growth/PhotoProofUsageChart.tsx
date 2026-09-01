'use client';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { PhotoProofWeek } from '@/lib/actions/growth';

function formatWeek(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function PhotoProofUsageChart({ data }: { data: PhotoProofWeek[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-espresso-400">No resolved markets in this window.</p>;
  }

  const chartData = data.map((d) => ({ week: formatWeek(d.week), rate: d.photo_rate ?? 0 }));

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e4d8cc" strokeDasharray="3 3" />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#8c6f5c' }} axisLine={{ stroke: '#cbb6a2' }} tickLine={false} minTickGap={24} />
          <YAxis
            tick={{ fontSize: 11, fill: '#8c6f5c' }}
            axisLine={false}
            tickLine={false}
            width={32}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid #e4d8cc', fontSize: 12 }}
            labelStyle={{ color: '#3b2a20', fontWeight: 600 }}
            formatter={(value) => [`${value}%`, 'With photo']}
          />
          <Line type="monotone" dataKey="rate" stroke="#2a78d6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
