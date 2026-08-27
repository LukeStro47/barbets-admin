'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createPublicGroup, assignGroupModerator, listGroupModeratorCandidates, type ModeratorCandidate } from '@/lib/actions/admin-tools';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Switch } from '@/components/ui/Switch';
import { COMMON_TIMEZONES, friendlyTimezoneName } from '@/lib/timezone';

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const inputClasses =
  'w-full rounded-xl border border-espresso-200 bg-paper-dim px-3.5 py-[11px] text-[15px] text-espresso-900 focus:border-honey-500 focus:outline-none focus:ring-2 focus:ring-honey-200';
const selectClasses = `${inputClasses} font-semibold`;
const labelClasses = 'block text-[11px] font-bold tracking-[0.1em] text-espresso-400 uppercase';

export interface PublicGroupRow {
  id: string;
  name: string;
  category: 'generic' | 'campus';
  memberCount: number;
}

/** Ported from the main app's components/admin/AdminPublicGroupsForm.tsx. Staff (the admin
 *  submitting this) becomes the group's owner either way; joining as a seeded moderator member is
 *  an explicit opt-in via the "I'll moderate this group too" checkbox. */
export function CreatePublicGroupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'generic' | 'campus'>('generic');
  const [seedAmount, setSeedAmount] = useState('1000');
  const [selfModerate, setSelfModerate] = useState(false);
  const [nickname, setNickname] = useState('');
  const [moderatorEmails, setModeratorEmails] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [error, setError] = useState<string | null>(null);
  const [unresolvedEmails, setUnresolvedEmails] = useState<string[] | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    setError(null);
    setUnresolvedEmails(null);
    startTransition(async () => {
      const emails = moderatorEmails
        .split(/[\n,]/)
        .map((e) => e.trim())
        .filter(Boolean);
      const result = await createPublicGroup({
        name: name.trim(),
        category,
        seedAmount: Number(seedAmount) || 1000,
        timezone,
        nickname: selfModerate ? nickname.trim() : null,
        moderatorEmails: emails,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setName('');
        setNickname('');
        setModeratorEmails('');
        setSelfModerate(false);
        if (result.data!.unresolved_emails.length > 0) {
          setUnresolvedEmails(result.data!.unresolved_emails);
        }
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-sm text-danger-700">{error}</p>}
      {unresolvedEmails && (
        <p className="text-sm text-danger-700">
          Created, but no account matches: {unresolvedEmails.join(', ')}. They&apos;ll need to sign up first.
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label className={labelClasses}>Group name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} className={inputClasses} placeholder="WVU" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className={labelClasses}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as 'generic' | 'campus')} className={selectClasses}>
            <option value="generic">Generic</option>
            <option value="campus">Campus</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClasses}>Tokens</label>
          <input
            type="text"
            inputMode="numeric"
            value={seedAmount}
            onChange={(e) => setSeedAmount(e.target.value.replace(/\D/g, ''))}
            className={inputClasses}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClasses}>Time zone</label>
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={selectClasses}>
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {friendlyTimezoneName(tz)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClasses}>Moderator emails</label>
        <textarea
          value={moderatorEmails}
          onChange={(e) => setModeratorEmails(e.target.value)}
          rows={2}
          placeholder="one@wvu.edu, another@wvu.edu"
          className={inputClasses}
        />
        <p className="text-[12.5px] leading-[1.55] text-espresso-400">
          Assigned instantly, no invite needed. Each has to already have a Barbets account, added as an active member with a moderator
          role right away, with a push about it.
        </p>
      </div>

      <label className="flex items-center justify-between gap-3 rounded-2xl bg-paper-dim px-3.5 py-3">
        <span className="text-[14.5px] font-semibold text-espresso-800">I&apos;ll moderate this group too</span>
        <Switch checked={selfModerate} onChange={() => setSelfModerate((v) => !v)} />
      </label>
      {selfModerate && (
        <div className="flex flex-col gap-1.5">
          <label className={labelClasses}>Your nickname here</label>
          <input value={nickname} onChange={(e) => setNickname(e.target.value.toLowerCase())} maxLength={20} className={inputClasses} />
        </div>
      )}

      <Button
        type="button"
        variant="accent"
        size="lg"
        disabled={isPending || !name.trim() || (selfModerate && !nickname.trim())}
        onClick={submit}
        className="w-full"
      >
        {isPending ? 'Creating…' : 'Create public group'}
      </Button>
    </div>
  );
}

export function ManageModeratorsPanel({ group }: { group: PublicGroupRow }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl bg-paper-dim p-3.5 text-left"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-espresso-800 text-[15px] font-extrabold text-honey-500">
          {group.name.charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14.5px] font-bold text-espresso-900">{group.name}</span>
          <span className="block text-[12.5px] text-espresso-400">
            {capitalize(group.category)} &middot; {group.memberCount} member{group.memberCount === 1 ? '' : 's'}
          </span>
        </span>
        <span className="shrink-0 text-[12.5px] font-bold text-honey-700">Manage</span>
      </button>

      {open && <ManageModeratorsModal group={group} onClose={() => setOpen(false)} />}
    </>
  );
}

function ManageModeratorsModal({ group, onClose }: { group: PublicGroupRow; onClose: () => void }) {
  const [candidates, setCandidates] = useState<ModeratorCandidate[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await listGroupModeratorCandidates(group.id);
      if (result.error) setError(result.error);
      else setCandidates(result.data ?? []);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group.id]);

  const moderators = (candidates ?? []).filter((c) => c.role === 'moderator');
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return (candidates ?? []).filter((c) => c.role !== 'moderator' && c.nickname.toLowerCase().includes(q)).slice(0, 20);
  }, [query, candidates]);

  function setModerator(userId: string, next: boolean) {
    setError(null);
    startTransition(async () => {
      const result = await assignGroupModerator(group.id, userId, next);
      if (result.error) {
        setError(result.error);
        return;
      }
      setCandidates((prev) => (prev ?? []).map((c) => (c.user_id === userId ? { ...c, role: next ? 'moderator' : 'member' } : c)));
      if (next) setQuery('');
    });
  }

  return (
    <Modal onClose={onClose}>
      <p className="font-display text-lg font-extrabold tracking-[-0.015em] text-espresso-950">{group.name}</p>
      <p className="text-sm text-espresso-500">
        {group.memberCount} user{group.memberCount === 1 ? '' : 's'} · {capitalize(group.category)}
      </p>
      {error && <p className="text-sm text-danger-700">{error}</p>}

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-espresso-500">Moderators</label>
        {candidates === null ? (
          <p className="text-sm text-espresso-400">Loading…</p>
        ) : moderators.length === 0 ? (
          <p className="text-sm text-espresso-400">Nobody yet — add one below.</p>
        ) : (
          <div className="divide-y divide-espresso-50 rounded-xl border border-espresso-100">
            {moderators.map((m) => (
              <div key={m.user_id} className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="text-sm font-semibold text-espresso-800">@{m.nickname}</span>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setModerator(m.user_id, false)}
                  className="rounded-full border border-espresso-200 px-3 py-1 text-xs font-semibold text-espresso-600"
                >
                  Remove moderator
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-espresso-500">Add a moderator</label>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by nickname…" className={inputClasses} />
        {query.trim() && (
          <div className="divide-y divide-espresso-50 rounded-xl border border-espresso-100">
            {searchResults.length === 0 ? (
              <p className="px-3 py-2 text-sm text-espresso-400">No match.</p>
            ) : (
              searchResults.map((c) => (
                <div key={c.user_id} className="flex items-center justify-between gap-2 px-3 py-2">
                  <span className="text-sm text-espresso-800">@{c.nickname}</span>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => setModerator(c.user_id, true)}
                    className="rounded-full bg-honey-500 px-3 py-1 text-xs font-bold text-espresso-900"
                  >
                    Make moderator
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={onClose}>
        Done
      </Button>
    </Modal>
  );
}
