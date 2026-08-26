/** Thousands-separated number for display — e.g. 2450 -> "2,450". Copied from the main app's
 *  lib/formatNumber.ts (only the one helper this repo actually needs). */
export function formatTokens(n: number): string {
  return n.toLocaleString('en-US');
}
