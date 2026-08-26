import Link from 'next/link';
import { signOut } from '@/lib/actions/auth';

const LINKS = [
  { href: '/', label: 'Overview' },
  { href: '/growth', label: 'Growth' },
  { href: '/admin-tools', label: 'Admin tools' },
];

export function AdminNav({ current }: { current: string }) {
  return (
    <nav className="flex items-center justify-between gap-4 border-b border-espresso-100 px-5 py-3">
      <div className="flex items-center gap-5">
        <span className="font-display text-sm font-extrabold tracking-[-0.01em] text-espresso-950">Barbets Admin</span>
        <div className="flex items-center gap-3">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                link.href === current
                  ? 'text-sm font-semibold text-espresso-900'
                  : 'text-sm font-medium text-espresso-400 hover:text-espresso-700'
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <form action={signOut}>
        <button type="submit" className="text-xs font-semibold text-espresso-400 hover:text-espresso-700">
          Sign out
        </button>
      </form>
    </nav>
  );
}
