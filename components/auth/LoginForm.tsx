'use client';

import { useActionState } from 'react';
import { signIn } from '@/lib/actions/auth';
import { Button } from '@/components/ui/Button';
import { TurnstileField } from '@/components/auth/TurnstileField';

const inputClasses =
  'w-full rounded-2xl border border-[rgba(255,253,249,0.16)] bg-[rgba(255,253,249,0.06)] px-4 py-3.5 text-base text-paper-white focus:border-honey-500 focus:outline-none focus:ring-2 focus:ring-[rgba(232,163,61,0.25)]';
const labelClasses = 'block text-[11px] font-bold tracking-[0.12em] text-espresso-400 uppercase';

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, null);

  return (
    <form action={formAction} className="flex flex-col gap-3.5">
      {state?.error && <p className="text-sm text-danger-100">{state.error}</p>}
      <div className="flex flex-col gap-1.5">
        <label className={labelClasses}>Email</label>
        <input type="email" name="email" required autoComplete="email" className={inputClasses} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelClasses}>Password</label>
        <input type="password" name="password" required autoComplete="current-password" className={inputClasses} />
      </div>
      <TurnstileField resetKey={state} />
      <Button type="submit" variant="accent" size="xl" disabled={isPending} className="mt-1.5 w-full">
        {isPending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
