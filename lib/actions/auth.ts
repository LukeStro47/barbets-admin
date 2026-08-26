'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export interface AuthActionState {
  error?: string;
}

/** Plain email/password sign-in against the same Supabase project the main app uses — same
 *  account, but a distinct host-scoped cookie jar from app.mybarbets.com's, so a first visit here
 *  always needs its own sign-in even for an already-logged-in admin. No signup form: every account
 *  that can use this site already exists, created through the main app. */
export async function signIn(_prevState: AuthActionState | null, formData: FormData): Promise<AuthActionState | null> {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect('/');
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
