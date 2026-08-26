import { requireAdmin } from '@/lib/requireAdmin';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

/** Every route under this group is gated the same way each page already gates itself
 *  (requireAdmin() is cheap and idempotent) — the layout's own check is what stops a signed-in
 *  non-admin from seeing the sidebar shell at all, not a substitute for the page-level check. */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden px-10 py-8">
        <div className="mx-auto max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}
