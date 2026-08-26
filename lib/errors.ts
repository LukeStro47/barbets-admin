import type { PostgrestError } from '@supabase/supabase-js';

/**
 * Every SECURITY DEFINER function in the shared Barbets database raises errors with a
 * `<code>: <message>` convention. This is the single place that convention gets translated into
 * meaning on this site — copied verbatim from the main app's lib/errors.ts, since it's pure logic
 * with zero coupling to which repo it runs in.
 */
export type ActionErrorCode = 'not_found' | 'forbidden' | 'invalid_operation' | 'insufficient_balance' | 'unknown';

export class ActionError extends Error {
  code: ActionErrorCode;
  status: 404 | 403 | 422;

  constructor(code: ActionErrorCode, message: string) {
    super(message);
    this.code = code;
    this.status = code === 'not_found' ? 404 : code === 'forbidden' ? 403 : 422;
  }
}

const KNOWN_CODES: ActionErrorCode[] = ['not_found', 'forbidden', 'invalid_operation', 'insufficient_balance'];

export function toActionError(error: PostgrestError | Error | null): ActionError {
  const message = error?.message ?? 'Unknown error';
  const prefix = message.split(':')[0].trim() as ActionErrorCode;
  const code = KNOWN_CODES.includes(prefix) ? prefix : 'unknown';
  return new ActionError(code, message);
}

/**
 * Next.js redacts any error thrown out of a Server Action in production, so Server Actions must
 * never let an ActionError propagate as a throw; they return one of these instead, and the
 * calling client code checks `.error` rather than catching an exception.
 */
export type ActionResult<T> = { data: T; error?: undefined } | { data?: undefined; error: string };

/** Strips the internal `code: ` prefix (e.g. "forbidden: ") and capitalizes the rest, so the client shows plain human copy instead of what looks like an internal error code. */
export function friendlyMessage(err: ActionError): string {
  const rest = err.code === 'unknown' ? err.message : err.message.slice(err.code.length + 1).trim();
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}

export async function runRpc<T>(result: { data: T | T[] | null; error: PostgrestError | null }): Promise<ActionResult<T>> {
  if (result.error) {
    return { error: friendlyMessage(toActionError(result.error)) };
  }
  const data = Array.isArray(result.data) ? result.data[0] : result.data;
  return { data: data as T };
}
