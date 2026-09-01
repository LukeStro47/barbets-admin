'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MultiGroupBucket } from '@/lib/actions/users';

const ORDER = ['0', '1', '2', '3', '4', '5+'];

export function MultiGroupHistogram({ buckets }: { buckets: MultiGroupBucket[] }) {
  const byBucket = new Map(buckets.map((b) => [b.active_membership_bucket, b.user_count]));
  const data = ORDER.map((bucket) => ({ bucket, users: byBucket.get(bucket) ?? 0 }));

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e4d8cc" strokeDasharray="3 3" />
          <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: '#8c6f5c' }} axisLine={{ stroke: '#cbb6a2' }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#8c6f5c' }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
          <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e4d8cc', fontSize: 12 }} labelStyle={{ color: '#3b2a20', fontWeight: 600 }} />
          <Bar dataKey="users" fill="#e8a33d" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
