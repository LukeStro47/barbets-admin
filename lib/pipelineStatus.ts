import type { PipelineHealth, PipelineSetting } from '@/lib/actions/admin-tools';

/** Shared between AdminPipelineTogglesForm (the full card) and AdminSidebar (the at-a-glance dot)
 *  so the two never disagree about what "healthy" means. Ported from the main app's
 *  components/admin/AdminPipelineTogglesForm.tsx. */
export const STALE_AFTER_MINUTES: Record<PipelineSetting['pipeline'], Record<PipelineHealth['job'], number>> = {
  sports: { create: 12 * 60 * 2, resolve: 90 },
  weather: { create: 24 * 60 * 2, resolve: 90 },
};

export function minutesAgo(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / 60_000;
}

export function formatAgo(iso: string): string {
  const mins = minutesAgo(iso);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${Math.round(mins)}m ago`;
  const hours = mins / 60;
  if (hours < 48) return `${Math.round(hours)}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/** Same as formatAgo but without the trailing "ago" — for the sidebar's tight one-line meta. */
export function formatAgoCompact(iso: string): string {
  const mins = minutesAgo(iso);
  if (mins < 1) return 'now';
  if (mins < 60) return `${Math.round(mins)}m`;
  const hours = mins / 60;
  if (hours < 48) return `${Math.round(hours)}h`;
  return `${Math.round(hours / 24)}d`;
}

export type PipelineStatus = 'off' | 'failing' | 'stale' | 'healthy' | 'unknown';

export function pipelineStatus(pipeline: PipelineSetting['pipeline'], enabled: boolean, jobs: PipelineHealth[]): PipelineStatus {
  if (!enabled) return 'off';
  if (jobs.length === 0) return 'unknown';
  if (jobs.some((j) => j.open_failure_count > 0)) return 'failing';
  if (jobs.some((j) => !j.last_run_at || minutesAgo(j.last_run_at) > STALE_AFTER_MINUTES[pipeline][j.job])) return 'stale';
  return 'healthy';
}
