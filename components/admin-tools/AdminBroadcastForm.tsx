'use client';

import { useEffect, useState, useTransition } from 'react';
import { sendAdminBroadcast } from '@/lib/actions/admin-tools';
import { Button } from '@/components/ui/Button';
import { BellIcon } from '@/components/ui/icons';

const inputClasses =
  'w-full rounded-xl border border-espresso-200 bg-paper-dim px-3.5 py-[11px] text-[15px] text-espresso-900 focus:border-honey-500 focus:outline-none focus:ring-2 focus:ring-honey-200';
const selectClasses = `${inputClasses} font-semibold`;
const labelClasses = 'block text-[11px] font-bold tracking-[0.1em] text-espresso-400 uppercase';

interface GroupOption {
  id: string;
  name: string;
  memberCount: number;
  members: { userId: string; nickname: string }[];
}

/** Ported from the main app's components/admin/AdminBroadcastForm.tsx. Body-only — every real push
 *  in the main repo's supabase/functions/send-push/index.ts uses the group's own name as the
 *  title, so {group} is auto-filled from the selected group rather than asked for. */
const TEMPLATES: { label: string; body: string }[] = [
  { label: 'Custom', body: '' },
  { label: 'Needs endorsement', body: 'A new market needs an endorser before it can open: "{title}"' },
  { label: 'Market opened', body: 'Betting’s open on a new market: "{title}"' },
  { label: 'Market opened about you', body: 'A new market just opened about you. No spoilers, but you can watch the action.' },
  { label: 'Market closed', body: 'Betting just closed, odds are live: "{title}"' },
  { label: 'Resolution proposed', body: 'Someone proposed how "{title}" resolved. You have {window} to challenge it.' },
  { label: 'Resolution challenged', body: 'The proposed resolution for "{title}" was challenged, cast your vote.' },
  { label: 'Resolved (subject)', body: 'A market about you just resolved, come see what it was: "{title}"' },
  { label: 'Resolved (winning bettor)', body: 'You won {tokens} tokens! "{title}" resolved: {outcome}.' },
  { label: 'Resolved (everyone else)', body: '"{title}" resolved: {outcome}. See how it played out.' },
  { label: 'Season ended', body: "Season {number} just wrapped up. Check the final standings and start the next one when you're ready." },
  { label: 'Betting opened', body: 'Betting just opened. Be the first to start a market.' },
  { label: 'Impressive bet', body: 'You just pulled off the biggest underdog win in {group}’s history, {multiple}x on "{title}"!' },
  { label: 'Member joined', body: '@{nickname} just joined {group}. Say hi, or get a market going.' },
  { label: 'Market voided', body: 'The owner voided "{title}" and refunded every stake.' },
  { label: 'Clarification requested', body: "@{nickname} isn't clear on how \"{title}\" resolves and is asking you to clarify." },
  { label: 'Criteria updated', body: 'The resolution criteria for "{title}" just got clearer, take a look.' },
  {
    label: 'Group deletion scheduled',
    body: 'The owner deleted {group}. Every open market was refunded, and the group itself is gone for good in 5 days unless they undo it.',
  },
  { label: 'Group deletion canceled', body: 'False alarm, the owner canceled the deletion of {group}.' },
  {
    label: 'Group deletion scheduled (inactivity)',
    body: "Nobody's started a new season in {group} for 30 days, so it'll be deleted for good in 5 days unless someone continues it.",
  },
  { label: 'Season betting opened', body: 'Betting just opened for the season. Time to start a market.' },
  { label: 'Awards updated', body: 'The Awards just shuffled. See who holds what now.' },
];

const PLACEHOLDER_LABELS: Record<string, string> = {
  title: 'Market/item title',
  tokens: 'Tokens',
  outcome: 'Outcome',
  window: 'Challenge window (e.g. 8 hours)',
  number: 'Season number',
  multiple: 'Payout multiple (e.g. 3.2)',
  nickname: 'Nickname',
};

function extractPlaceholders(template: string): string[] {
  const found = new Set<string>();
  for (const match of template.matchAll(/\{(\w+)\}/g)) {
    if (match[1] !== 'group') found.add(match[1]);
  }
  return [...found];
}

export function AdminBroadcastForm({ groups }: { groups: GroupOption[] }) {
  const [groupId, setGroupId] = useState(groups[0]?.id ?? '');
  const group = groups.find((g) => g.id === groupId);

  const [recipient, setRecipient] = useState('');
  const [templateIndex, setTemplateIndex] = useState(0);
  const template = TEMPLATES[templateIndex];
  const isCustom = templateIndex === 0;

  const [title, setTitle] = useState(group?.name ?? '');
  const [customBody, setCustomBody] = useState('');
  const [fillins, setFillins] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setTitle(group?.name ?? '');
    setRecipient('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  useEffect(() => {
    setFillins({});
  }, [templateIndex]);

  if (groups.length === 0) {
    return <p className="text-sm text-espresso-400">No groups to broadcast to yet.</p>;
  }

  const placeholders = isCustom ? [] : extractPlaceholders(template.body);
  const assembledBody = isCustom
    ? customBody
    : template.body.replace(/\{(\w+)\}/g, (_, key) => (key === 'group' ? (group?.name ?? '') : (fillins[key] ?? '')));
  const bodyReady = isCustom ? customBody.trim().length > 0 : placeholders.every((p) => fillins[p]?.trim());

  function submit() {
    setError(null);
    setSent(false);
    startTransition(async () => {
      const result = await sendAdminBroadcast(groupId, title, assembledBody, recipient || null);
      if (result.error) {
        setError(result.error);
      } else {
        setSent(true);
        setCustomBody('');
        setFillins({});
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-sm text-danger-700">{error}</p>}
      {sent && <p className="text-sm font-semibold text-success-700">Queued — lands within a minute.</p>}

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className={labelClasses}>Group</label>
          <select value={groupId} onChange={(e) => setGroupId(e.target.value)} className={selectClasses}>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.memberCount} member{g.memberCount === 1 ? '' : 's'})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClasses}>Send to</label>
          <select value={recipient} onChange={(e) => setRecipient(e.target.value)} className={selectClasses}>
            <option value="">Everyone in the group</option>
            {(group?.members ?? []).map((m) => (
              <option key={m.userId} value={m.userId}>
                @{m.nickname}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClasses}>Template</label>
        <select
          value={templateIndex}
          onChange={(e) => setTemplateIndex(Number(e.target.value))}
          className={`${selectClasses} border-honey-500 bg-honey-50`}
        >
          {TEMPLATES.map((t, i) => (
            <option key={t.label} value={i}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClasses}>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} className={inputClasses} />
      </div>

      {isCustom ? (
        <div className="flex flex-col gap-1.5">
          <label className={labelClasses}>Body</label>
          <textarea
            value={customBody}
            onChange={(e) => setCustomBody(e.target.value)}
            maxLength={300}
            rows={3}
            className={inputClasses}
            placeholder="What the push notification says"
          />
        </div>
      ) : (
        <>
          {placeholders.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {placeholders.map((p) => (
                <label key={p} className="flex flex-col gap-1.5">
                  <span className={labelClasses}>{PLACEHOLDER_LABELS[p] ?? p}</span>
                  <input
                    value={fillins[p] ?? ''}
                    onChange={(e) => setFillins((prev) => ({ ...prev, [p]: e.target.value }))}
                    className={inputClasses}
                  />
                </label>
              ))}
            </div>
          )}
          <div className="flex gap-3 rounded-2xl bg-[linear-gradient(158deg,#3b2a20,#1c130d)] p-4">
            <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] bg-[rgba(232,163,61,0.18)] text-honey-500">
              <BellIcon className="h-[18px] w-[18px]" />
            </span>
            <span className="min-w-0">
              <span className="block text-[13.5px] font-bold text-paper-white">{group?.name}</span>
              <span className="block text-[13.5px] leading-[1.45] text-espresso-100">{assembledBody}</span>
            </span>
          </div>
        </>
      )}

      <Button type="button" variant="accent" size="lg" disabled={isPending || !title.trim() || !bodyReady} onClick={submit} className="w-full">
        {isPending ? 'Sending…' : 'Send broadcast'}
      </Button>
    </div>
  );
}
