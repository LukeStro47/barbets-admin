import type { RetentionCohortRow } from '@/lib/actions/growth';

function formatCohort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Sequential magnitude encoding (retention %), one hue light->dark, per the dataviz skill's
 *  "sequential = one hue" rule — this is the skill's default blue ramp's 100-700 steps, an
 *  ordinal-safe subset (nothing lighter than step 250, so every filled cell clears 2:1 against
 *  the card surface even at low retention). Empty/not-yet-elapsed cells stay blank rather than
 *  rendering as a fake zero. */
const RAMP = ['#86b6ef', '#6da7ec', '#5598e7', '#3987e5', '#2a78d6', '#256abf', '#1c5cab', '#184f95', '#104281', '#0d366b'];

function rampColor(pct: number): string {
  const idx = Math.min(RAMP.length - 1, Math.floor((pct / 100) * RAMP.length));
  return RAMP[Math.max(0, idx)];
}

function textColorFor(pct: number): string {
  // The lightest two ramp steps read better with dark ink; everything darker wants white.
  return pct < 20 ? '#1c130d' : '#fffdf9';
}

export function RetentionCohortGrid({ rows }: { rows: RetentionCohortRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-espresso-400">No cohort data yet.</p>;
  }

  const cohortWeeks = [...new Set(rows.map((r) => r.cohort_week))].sort((a, b) => b.localeCompare(a));
  const maxOffset = Math.max(...rows.map((r) => r.weeks_since_signup));
  const byCell = new Map(rows.map((r) => [`${r.cohort_week}:${r.weeks_since_signup}`, r]));
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
                if (!cell) return <td key={offset} className="rounded bg-espresso-50/40 px-1 py-1.5 text-center text-espresso-200">—</td>;
                const pct = cell.cohort_size > 0 ? Math.round((cell.active_users / cell.cohort_size) * 100) : 0;
                return (
                  <td
                    key={offset}
                    className="rounded px-1 py-1.5 text-center font-semibold"
                    style={{ backgroundColor: rampColor(pct), color: textColorFor(pct) }}
                    title={`${cell.active_users} of ${cell.cohort_size} active`}
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
