import Link from 'next/link';
import type { GroupLifecycleRow } from '@/lib/actions/groups';
import { GROUP_STATE_BADGE, GROUP_STATE_LABEL } from '@/lib/lifecycleLabels';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function GroupsTable({ rows }: { rows: GroupLifecycleRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-espresso-400">No private groups yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-espresso-100 text-[11px] font-bold tracking-[0.1em] text-espresso-400 uppercase">
            <th className="py-2 pr-3">Group</th>
            <th className="px-3 py-2">State</th>
            <th className="px-3 py-2 text-right">Members</th>
            <th className="px-3 py-2 text-right">Created</th>
            <th className="py-2 pl-3 text-right">Deletion</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.group_id} className="border-b border-espresso-50 last:border-0">
              <td className="py-2.5 pr-3">
                <Link href={`/groups/${r.group_id}`} className="font-bold text-espresso-900 hover:text-honey-700">
                  {r.group_name}
                </Link>
              </td>
              <td className="px-3 py-2.5">
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-[0.06em] uppercase ${GROUP_STATE_BADGE[r.lifecycle_state]}`}>
                  {GROUP_STATE_LABEL[r.lifecycle_state]}
                </span>
              </td>
              <td className="px-3 py-2.5 text-right text-espresso-600">{r.member_count}</td>
              <td className="px-3 py-2.5 text-right text-espresso-500">{formatDate(r.created_at)}</td>
              <td className="py-2.5 pl-3 text-right text-danger-700">{r.deletion_scheduled_at ? formatDate(r.deletion_scheduled_at) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
