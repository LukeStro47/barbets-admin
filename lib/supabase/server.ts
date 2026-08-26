import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

/**
 * Per-request Supabase client built from the caller's session cookies — every query through this
 * client runs as that real signed-in user, subject to RLS. Same pattern as the main app's
 * lib/supabase/server.ts; this is a separate Vercel project on its own subdomain, so an admin's
 * session here is a distinct, host-scoped cookie jar from app.mybarbets.com's, even when it's the
 * same underlying account.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component rather than a Server Action/Route Handler — cookies
          // can't be written here. Harmless as long as proxy.ts is also refreshing the session on
          // every request.
        }
      },
    },
  });
}

/** The signed-in user, or a redirect to /login. Every page in this repo must call this — every
 *  route here is admin-only, so there is no page that should ever render for a signed-out
 *  visitor. */
export async function requireUser(supabase: Awaited<ReturnType<typeof createClient>>): Promise<User> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return user;
}
