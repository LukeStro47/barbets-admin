'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/actions/auth';

const LINKS = [
  { href: '/', label: 'Overview' },
  { href: '/growth', label: 'Growth' },
  { href: '/admin-tools', label: 'Admin tools' },
];

/** Persistent left-nav shell, the thing that makes this read as a desktop admin console rather
 *  than the main app's mobile-first bottom nav. Client component so it can read the current path
 *  for the active-link highlight without threading a `current` prop through every page. */
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-dvh w-56 shrink-0 flex-col border-r border-espresso-100 bg-paper-white">
      <div className="px-5 py-6">
        <span className="font-display text-base font-extrabold tracking-[-0.01em] text-espresso-950">Barbets Admin</span>
      </div>
      <nav className="flex-1 space-y-0.5 px-3">
        {LINKS.map((link) => {
          const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? 'block rounded-lg bg-honey-100 px-3 py-2 text-sm font-semibold text-espresso-900'
                  : 'block rounded-lg px-3 py-2 text-sm font-medium text-espresso-500 hover:bg-espresso-50 hover:text-espresso-800'
              }
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <form action={signOut} className="border-t border-espresso-100 px-5 py-4">
        <button type="submit" className="text-xs font-semibold text-espresso-400 hover:text-espresso-700">
          Sign out
        </button>
      </form>
    </aside>
  );
}
