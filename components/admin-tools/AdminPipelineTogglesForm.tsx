'use client';

import { useState, useTransition } from 'react';
import { setPipelineEnabled, type PipelineHealth, type PipelineSetting } from '@/lib/actions/admin-tools';
import { formatAgo, pipelineStatus, type PipelineStatus } from '@/lib/pipelineStatus';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Switch } from '@/components/ui/Switch';

const PIPELINE_LABEL: Record<PipelineSetting['pipeline'], string> = {
  sports: 'Sports',
  weather: 'Weather',
};

const PIPELINE_SOURCE: Record<PipelineSetting['pipeline'], string> = {
  sports: 'The Odds API',
  weather: 'api.weather.gov',
};

const PIPELINE_SCHEDULE: Record<PipelineSetting['pipeline'], string> = {
  sports: 'creates every 12h, resolves every 30min',
  weather: 'creates daily at noon, resolves every 30min',
};

const JOB_LABEL: Record<PipelineHealth['job'], string> = { create: 'Create', resolve: 'Resolve' };

const STATUS_BADGE: Record<PipelineStatus, { label: string; className: string }> = {
  off: { label: 'Off', className: 'bg-espresso-100 text-espresso-500' },
  failing: { label: 'Failing', className: 'bg-danger-100 text-danger-700' },
  stale: { label: 'Stale', className: 'bg-honey-100 text-honey-800' },
  healthy: { label: 'Healthy', className: 'bg-success-100 text-success-700' },
  unknown: { label: 'No runs yet', className: 'bg-espresso-100 text-espresso-500' },
};

export function AdminPipelineTogglesForm({ settings, health }: { settings: PipelineSetting[]; health: PipelineHealth[] }) {
  const [rows, setRows] = useState(settings);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState<{ pipeline: PipelineSetting['pipeline']; next: boolean } | null>(null);

  function confirmToggle() {
    if (!confirming) return;
    const { pipeline, next } = confirming;
    setError(null);
    startTransition(async () => {
      const result = await setPipelineEnabled(pipeline, next);
      if (result.error) {
        setError(result.error);
      } else {
        setRows((prev) => prev.map((r) => (r.pipeline === pipeline ? { ...r, enabled: next } : r)));
      }
      setConfirming(null);
    });
  }

  return (
    <div className="flex flex-col gap-2.5">
      {error && <p className="text-sm text-danger-700">{error}</p>}
      <div className="flex flex-col gap-2.5">
        {rows.map((r) => {
          const jobs = health.filter((h) => h.pipeline === r.pipeline);
          const status = pipelineStatus(r.pipeline, r.enabled, jobs);
          const badge = STATUS_BADGE[status];

          return (
            <div
              key={r.pipeline}
              className="flex flex-col gap-3.5 rounded-2xl bg-[linear-gradient(158deg,#3b2a20,#1c130d)] p-[18px]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-paper-white">{PIPELINE_LABEL[r.pipeline]}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${badge.className}`}>{badge.label}</span>
                  </div>
                  <p className="mt-0.5 text-[12.5px] text-espresso-300">
                    {PIPELINE_SOURCE[r.pipeline]} &middot; {PIPELINE_SCHEDULE[r.pipeline]}
                  </p>
                </div>
                <Switch checked={r.enabled} disabled={isPending} onChange={() => setConfirming({ pipeline: r.pipeline, next: !r.enabled })} />
              </div>

              {jobs.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5 border-t border-dashed border-[rgba(232,163,61,0.3)] pt-3 text-[12.5px]">
                  {jobs.map((j) => (
                    <div key={j.job}>
                      <p className="font-bold text-espresso-100">{JOB_LABEL[j.job]}</p>
                      {j.last_run_at ? (
                        <p className="text-espresso-300">
                          {formatAgo(j.last_run_at)}: {j.last_run_succeeded ?? 0} ok, {j.last_run_failed ?? 0} failed
                        </p>
                      ) : (
                        <p className="text-espresso-300">Never run</p>
                      )}
                      {j.open_failure_count > 0 && (
                        <p className="font-bold text-honey-400">
                          {j.open_failure_count} stuck failure{j.open_failure_count === 1 ? '' : 's'}
                          {j.last_failure_message ? `: ${j.last_failure_message}` : ''}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {confirming && (
        <Modal onClose={() => setConfirming(null)}>
          <p className="font-display text-lg font-extrabold tracking-[-0.015em] text-espresso-950">
            {confirming.next ? `Turn on ${PIPELINE_LABEL[confirming.pipeline]}?` : `Turn off ${PIPELINE_LABEL[confirming.pipeline]}?`}
          </p>
          <p className="text-sm leading-[1.55] text-espresso-600">
            {confirming.next
              ? `This starts real calls to ${PIPELINE_SOURCE[confirming.pipeline]} and creates real markets in the public ${
                  confirming.pipeline === 'sports' ? 'Sports' : 'Weather'
                } group on schedule (${PIPELINE_SCHEDULE[confirming.pipeline]}).`
              : 'Scheduled runs stop immediately, nothing new is created or resolved. Anything already open in this pipeline just sits unresolved until you turn it back on or resolve it by hand.'}
          </p>
          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setConfirming(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant={confirming.next ? 'accent' : 'danger'}
              className="flex-1"
              disabled={isPending}
              onClick={confirmToggle}
            >
              {confirming.next ? 'Turn on' : 'Turn off'}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
