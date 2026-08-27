'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/actions/auth';
import { BarChartIcon, SettingsIcon, SignOutIcon, TargetIcon } from '@/components/ui/icons';
import type { PipelineStatus } from '@/lib/pipelineStatus';

const LINKS = [
  { href: '/', label: 'Overview', Icon: TargetIcon },
  { href: '/growth', label: 'Growth', Icon: BarChartIcon },
  { href: '/admin-tools', label: 'Admin tools', Icon: SettingsIcon },
];

const DOT_CLASS: Record<PipelineStatus, string> = {
  off: 'bg-espresso-400',
  failing: 'bg-danger-500',
  stale: 'bg-honey-500',
  healthy: 'bg-success-500',
  unknown: 'bg-espresso-400',
};

const PIPELINE_NAME: Record<'sports' | 'weather', string> = { sports: 'Sports', weather: 'Weather' };

export interface SidebarPipeline {
  pipeline: 'sports' | 'weather';
  status: PipelineStatus;
  meta: string;
}

/** Persistent left-nav shell, the thing that makes this read as a desktop admin console rather
 *  than the main app's mobile-first bottom nav. Client component so it can read the current path
 *  for the active-link highlight without threading a `current` prop through every page. */
export function AdminSidebar({ email, pipelines }: { email: string; pipelines: SidebarPipeline[] }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-dvh w-[248px] shrink-0 flex-col bg-espresso-900">
      <div className="flex items-center gap-2.5 px-[22px] pt-[26px] pb-6">
        <Image src="/barbets-mono-white.png" alt="" width={30} height={30} className="block" />
        <span className="flex flex-col leading-[1.1]">
          <span className="text-[17px] font-extrabold tracking-[-0.02em] text-paper-white">Barbets</span>
          <span className="text-[10px] font-bold tracking-[0.16em] text-honey-500 uppercase">Admin</span>
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {LINKS.map(({ href, label, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={
                active
                  ? 'flex items-center gap-2.5 rounded-xl bg-[rgba(232,163,61,0.16)] px-3 py-2.5 text-[15px] font-bold text-honey-400'
                  : 'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[15px] font-semibold text-espresso-300 transition-colors hover:bg-[rgba(255,253,249,0.06)] hover:text-espresso-100'
              }
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mb-3 rounded-2xl bg-[rgba(255,253,249,0.06)] p-3.5">
        <p className="mb-2.5 text-[10px] font-bold tracking-[0.14em] text-espresso-400 uppercase">Pipelines</p>
        {pipelines.map((p) => (
          <div key={p.pipeline} className="flex items-center gap-2 py-[3px]">
            <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${DOT_CLASS[p.status]}`} />
            <span className="flex-1 text-[13px] font-semibold text-espresso-100">{PIPELINE_NAME[p.pipeline]}</span>
            <span className={`text-[11px] ${p.status === 'failing' ? 'text-danger-500' : 'text-espresso-400'}`}>{p.meta}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 border-t border-[rgba(255,253,249,0.1)] px-[22px] py-4">
        <p className="text-xs font-semibold text-espresso-400">{email}</p>
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-1.5 text-xs font-bold text-espresso-300 transition-colors hover:text-espresso-100"
          >
            <SignOutIcon className="h-3.5 w-3.5" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
