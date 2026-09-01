'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { SeasonLengthRow } from '@/lib/actions/growth';

const LENGTH_LABEL: Record<string, string> = { '1m': '1 month', '2m': '2 months', '3m': '3 months', manual: 'Manual', custom: 'Custom' };
const LENGTH_ORDER = ['1m', '2m', '3m', 'manual', 'custom'];
const LENGTH_COLOR: Record<string, string> = {
  '1m': '#2a78d6',
  '2m': '#eb6834',
  '3m': '#e8a33d',
  manual: '#8c6f5c',
  custom: '#6b7f99',
};

/** Stacked bar, one series per season_length -- reads seasons.season_length (the
 *  frozen per-season record), so this is what groups actually ran, not their current
 *  group_settings config. */
export function SeasonLengthTrendChart({ rows }: { rows: SeasonLengthRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-espresso-400">No seasons started in this window.</p>;
  }

  const periods = [...new Set(rows.map((r) => r.period_start))].sort();
  const byCell = new Map(rows.map((r) => [`${r.period_start}:${r.season_length}`, r.season_count]));
  const chartData = periods.map((period) => {
    const row: Record<string, string | number> = { period: new Date(period).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
    for (const length of LENGTH_ORDER) row[length] = byCell.get(`${period}:${length}`) ?? 0;
    return row;
  });

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e4d8cc" strokeDasharray="3 3" />
          <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#8c6f5c' }} axisLine={{ stroke: '#cbb6a2' }} tickLine={false} minTickGap={24} />
          <YAxis tick={{ fontSize: 11, fill: '#8c6f5c' }} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e4d8cc', fontSize: 12 }} labelStyle={{ color: '#3b2a20', fontWeight: 600 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} formatter={(value: string) => LENGTH_LABEL[value] ?? value} />
          {LENGTH_ORDER.map((length) => (
            <Bar key={length} dataKey={length} stackId="length" fill={LENGTH_COLOR[length]} name={length} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
