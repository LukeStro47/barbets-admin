'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { SettingsUpdateWeek } from '@/lib/actions/growth';

function formatWeek(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Bars are total settings saves per week; basic_changed/advanced_changed aren't
 *  mutually exclusive (one save can trip both), so they're summarized as totals below
 *  the chart rather than stacked, which would double-count any save that touched
 *  both tiers. */
export function SettingsUpdateFrequencyChart({ data }: { data: SettingsUpdateWeek[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-espresso-400">No settings changes in this window.</p>;
  }

  const chartData = data.map((d) => ({ week: formatWeek(d.week), updates: d.updates_total }));
  const totalBasic = data.reduce((sum, d) => sum + d.updates_basic, 0);
  const totalAdvanced = data.reduce((sum, d) => sum + d.updates_advanced, 0);
  const totalUpdates = data.reduce((sum, d) => sum + d.updates_total, 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#e4d8cc" strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#8c6f5c' }} axisLine={{ stroke: '#cbb6a2' }} tickLine={false} minTickGap={24} />
            <YAxis tick={{ fontSize: 11, fill: '#8c6f5c' }} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e4d8cc', fontSize: 12 }} labelStyle={{ color: '#3b2a20', fontWeight: 600 }} />
            <Bar dataKey="updates" fill="#e8a33d" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[12px] text-espresso-400">
        {totalUpdates} saves total &middot; {totalBasic} touched a basic field &middot; {totalAdvanced} touched an advanced field
      </p>
    </div>
  );
}
