import { notFound } from 'next/navigation';
import { createClient, requireUser } from '@/lib/supabase/server';

/**
 * Every route in this repo is admin-only, so this is the one gate every page calls. Same
 * 404-not-403 posture as the main app's /admin: a signed-in non-admin gets notFound(), not a
 * "you don't have permission" message, so the page's existence is never confirmed to them.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  const { data: isAdmin } = await supabase.rpc('is_platform_admin');
  if (!isAdmin) notFound();

  return { supabase, user };
}
