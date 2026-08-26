import { Card } from '@/components/ui/Card';
import { formatTokens } from '@/lib/formatNumber';

/** Promoted out of an inline component in the main app's admin/page.tsx, since this site has more
 *  than one page that wants it. */
export function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <Card className="text-center">
      <p className="font-display text-3xl font-bold text-espresso-900">{formatTokens(value)}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-espresso-400">{label}</p>
    </Card>
  );
}
