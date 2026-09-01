import type { GroupDetail } from '@/lib/actions/groupDetail';
import { GROUP_STATE_BADGE, GROUP_STATE_LABEL } from '@/lib/lifecycleLabels';
import { formatTokens } from '@/lib/formatNumber';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function GroupDetailHeader({ group }: { group: GroupDetail }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[30px] font-extrabold tracking-[-0.02em] text-espresso-950">{group.name}</h1>
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-[0.06em] uppercase ${GROUP_STATE_BADGE[group.lifecycle_state]}`}>
              {GROUP_STATE_LABEL[group.lifecycle_state]}
            </span>
          </div>
          <p className="text-[13px] text-espresso-500">
            Owned by {group.owner_nickname ?? 'unknown'} &middot; created {formatDate(group.created_at)}
            {group.category ? ` · ${group.category}` : ''}
          </p>
        </div>
        {group.deletion_scheduled_at && (
          <div className="rounded-xl border border-danger-100 bg-danger-100/40 px-3.5 py-2.5 text-right">
            <p className="text-[10.5px] font-bold tracking-[0.1em] text-danger-700 uppercase">Scheduled for deletion</p>
            <p className="text-[13px] font-bold text-danger-700">{formatDate(group.deletion_scheduled_at)}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-6 gap-3">
        <Stat label="Members" value={formatTokens(group.member_count)} />
        <Stat label="Active members" value={formatTokens(group.active_member_count)} />
        <Stat label="Markets" value={formatTokens(group.total_markets)} />
        <Stat label="Bets" value={formatTokens(group.total_bets)} />
        <Stat label="Tokens wagered" value={formatTokens(group.total_tokens_wagered)} />
        <Stat
          label="Season"
          value={group.current_season_number ? `#${group.current_season_number} ${group.current_season_status ?? ''}` : '—'}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-espresso-100 bg-paper-white p-[14px]">
      <p className="text-[20px] leading-none font-extrabold tracking-[-0.02em] text-espresso-950">{value}</p>
      <p className="mt-1.5 text-[10.5px] font-bold tracking-[0.08em] text-espresso-400 uppercase">{label}</p>
    </div>
  );
}
