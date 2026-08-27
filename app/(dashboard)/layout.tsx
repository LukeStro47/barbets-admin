import { requireAdmin } from '@/lib/requireAdmin';
import { AdminSidebar, type SidebarPipeline } from '@/components/layout/AdminSidebar';
import { pipelineStatus, formatAgoCompact } from '@/lib/pipelineStatus';
import type { PipelineHealth, PipelineSetting } from '@/lib/actions/admin-tools';

/** Every route under this group is gated the same way each page already gates itself
 *  (requireAdmin() is cheap and idempotent) — the layout's own check is what stops a signed-in
 *  non-admin from seeing the sidebar shell at all, not a substitute for the page-level check. */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user } = await requireAdmin();

  const [{ data: settings }, { data: health }] = (await Promise.all([
    supabase.rpc('list_pipeline_settings'),
    supabase.rpc('list_pipeline_health'),
  ])) as [{ data: PipelineSetting[] | null }, { data: PipelineHealth[] | null }];

  const pipelines: SidebarPipeline[] = (settings ?? []).map((s) => {
    const jobs = (health ?? []).filter((h) => h.pipeline === s.pipeline);
    const status = pipelineStatus(s.pipeline, s.enabled, jobs);
    const openFailures = jobs.reduce((sum, j) => sum + j.open_failure_count, 0);
    const lastRunAt = jobs
      .map((j) => j.last_run_at)
      .filter((d): d is string => !!d)
      .sort()
      .at(-1);
    const meta = status === 'failing' ? `${openFailures} stuck` : lastRunAt ? formatAgoCompact(lastRunAt) : '—';
    return { pipeline: s.pipeline, status, meta };
  });

  return (
    <div className="flex h-dvh overflow-hidden">
      <AdminSidebar email={user.email ?? ''} pipelines={pipelines} />
      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-10 pt-8 pb-10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-[22px]">{children}</div>
      </main>
    </div>
  );
}
