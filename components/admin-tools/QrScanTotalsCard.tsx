import type { QrScanTotal } from '@/lib/actions/admin-tools';

function formatAgo(iso: string): string {
  const mins = (Date.now() - new Date(iso).getTime()) / 60_000;
  if (mins < 1) return 'just now';
  if (mins < 60) return `${Math.round(mins)}m ago`;
  const hours = mins / 60;
  if (hours < 48) return `${Math.round(hours)}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function QrScanTotalsCard({ totals }: { totals: QrScanTotal[] }) {
  if (totals.length === 0) {
    return <p className="text-sm text-espresso-400">No scans logged yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {totals.map((t) => (
        <div key={t.batch} className="flex items-center gap-4 rounded-2xl bg-paper-dim px-4 py-3.5">
          <div className="min-w-0 flex-1">
            <p className="text-[14.5px] font-bold text-espresso-900">/go/{t.batch}</p>
            <p className="text-[12.5px] text-espresso-400">
              {t.android_count} Android, {t.ios_count} iOS, {t.other_count} other &middot; last {formatAgo(t.last_scanned_at)}
            </p>
          </div>
          <p className="text-2xl leading-none font-extrabold tracking-[-0.025em] text-espresso-950">{t.total_count}</p>
        </div>
      ))}
    </div>
  );
}
