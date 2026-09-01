import type { GroupCohortRow } from '@/lib/actions/groups';

function formatCohort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Same sequential ramp and layout as the user retention grid (components/growth/RetentionCohortGrid.tsx),
 *  one level up: cohort = group creation week instead of signup week, "active" = any market or
 *  bet event that week instead of any lifecycle_events row. */
const RAMP = ['#86b6ef', '#6da7ec', '#5598e7', '#3987e5', '#2a78d6', '#256abf', '#1c5cab', '#184f95', '#104281', '#0d366b'];

function rampColor(pct: number): string {
  const idx = Math.min(RAMP.length - 1, Math.floor((pct / 100) * RAMP.length));
  return RAMP[Math.max(0, idx)];
}

function textColorFor(pct: number): string {
  return pct < 20 ? '#1c130d' : '#fffdf9';
}

export function GroupRetentionCohortGrid({ rows }: { rows: GroupCohortRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-espresso-400">No cohort data yet.</p>;
  }

  const cohortWeeks = [...new Set(rows.map((r) => r.cohort_week))].sort((a, b) => b.localeCompare(a));
  const maxOffset = Math.max(...rows.map((r) => r.weeks_since_creation));
  const byCell = new Map(rows.map((r) => [`${r.cohort_week}:${r.weeks_since_creation}`, r]));
  const sizeByCohort = new Map(rows.map((r) => [r.cohort_week, r.cohort_size]));

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 text-xs">
        <thead>
          <tr>
            <th className="sticky left-0 bg-paper-white px-1 text-left font-semibold text-espresso-500">Cohort</th>
            <th className="px-1 text-left font-semibold text-espresso-500">Size</th>
            {Array.from({ length: maxOffset + 1 }, (_, i) => (
              <th key={i} className="px-1 text-center font-semibold text-espresso-500">
                W{i}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohortWeeks.map((week) => (
            <tr key={week}>
              <td className="sticky left-0 whitespace-nowrap bg-paper-white px-1 font-semibold text-espresso-700">{formatCohort(week)}</td>
              <td className="px-1 text-espresso-500">{sizeByCohort.get(week)}</td>
              {Array.from({ length: maxOffset + 1 }, (_, offset) => {
                const cell = byCell.get(`${week}:${offset}`);
                if (!cell) return <td key={offset} className="rounded-[5px] bg-espresso-50/40 px-1 py-[7px] text-center text-espresso-200">—</td>;
                const pct = cell.cohort_size > 0 ? Math.round((cell.active_groups / cell.cohort_size) * 100) : 0;
                return (
                  <td
                    key={offset}
                    className="rounded-[5px] px-1 py-[7px] text-center font-bold"
                    style={{ backgroundColor: rampColor(pct), color: textColorFor(pct) }}
                    title={`${cell.active_groups} of ${cell.cohort_size} active`}
                  >
                    {pct}%
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
