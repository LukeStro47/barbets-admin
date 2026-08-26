'use client';

import { useEffect, useRef } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Ported from the main app's components/auth/TurnstileField.tsx (simplified to just the plain
 * field — this site has no resend-style deferred action to warrant DeferredTurnstileButton).
 * Required because Supabase's captcha toggle (Authentication > Attack Protection) is all-or-
 * nothing across the whole project, not per app: sign-in here is gated by the exact same setting
 * that protects the main app's sign-up form. Renders its own hidden `cf-turnstile-response` input,
 * which `signIn()` reads out of the form's FormData and passes through as `options.captchaToken`.
 */
export function TurnstileField({ resetKey }: { resetKey?: unknown }) {
  const ref = useRef<TurnstileInstance>(null);
  const prevResetKey = useRef(resetKey);

  useEffect(() => {
    if (resetKey !== prevResetKey.current) {
      prevResetKey.current = resetKey;
      // A token is single-use — after a failed submit (wrong password) the one already spent
      // needs replacing before the next attempt, or Supabase rejects it outright.
      ref.current?.reset();
    }
  }, [resetKey]);

  if (!SITE_KEY) return null;

  return <Turnstile ref={ref} siteKey={SITE_KEY} options={{ appearance: 'interaction-only', size: 'flexible' }} />;
}
