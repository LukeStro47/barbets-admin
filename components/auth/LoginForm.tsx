'use client';

import { useActionState } from 'react';
import { signIn } from '@/lib/actions/auth';
import { Button } from '@/components/ui/Button';

const inputClasses =
  'w-full rounded-xl border border-espresso-200 bg-paper-white px-4 py-2.5 text-espresso-900 focus:border-honey-500 focus:outline-none focus:ring-2 focus:ring-honey-200';

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, null);

  return (
    <form action={formAction} className="space-y-3">
      {state?.error && <p className="text-sm text-danger-700">{state.error}</p>}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-espresso-500">Email</label>
        <input type="email" name="email" required autoComplete="email" className={inputClasses} />
      </div>
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-espresso-500">Password</label>
        <input type="password" name="password" required autoComplete="current-password" className={inputClasses} />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
