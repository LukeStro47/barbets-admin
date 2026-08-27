import { requireAdmin } from '@/lib/requireAdmin';
import { AdminBroadcastForm } from '@/components/admin-tools/AdminBroadcastForm';
import { CreatePublicGroupForm, ManageModeratorsPanel } from '@/components/admin-tools/AdminPublicGroupsForm';
import { AdminPipelineTogglesForm } from '@/components/admin-tools/AdminPipelineTogglesForm';
import { QrScanTotalsCard } from '@/components/admin-tools/QrScanTotalsCard';
import { Card, CardHeader } from '@/components/ui/Card';
import type { PipelineHealth, PipelineSetting, QrScanTotal, GroupOption, GroupMember, PublicGroup } from '@/lib/actions/admin-tools';

/** Ported from the main app's app/(app)/admin/page.tsx, minus the platform stat tiles (moved to
 *  this repo's own overview page, "/"). Everything else — broadcast, public group creation,
 *  moderator management, pipeline toggles, QR totals — is unchanged, same RPCs. Laid out as a
 *  2-column desktop grid rather than one stacked mobile column; the moderators list spans full
 *  width since it can run long. */
export default async function AdminToolsPage() {
  const { supabase } = await requireAdmin();

  const [{ data: groups }, { data: members }, { data: publicGroups }, { data: pipelineSettings }, { data: pipelineHealth }, { data: qrScanTotals }] =
    (await Promise.all([
      supabase.rpc('list_groups_for_admin'),
      supabase.rpc('list_group_members_for_admin'),
      supabase.rpc('list_public_groups'),
      supabase.rpc('list_pipeline_settings'),
      supabase.rpc('list_pipeline_health'),
      supabase.rpc('list_qr_scan_totals'),
    ])) as [
      { data: GroupOption[] | null },
      { data: GroupMember[] | null },
      { data: PublicGroup[] | null },
      { data: PipelineSetting[] | null },
      { data: PipelineHealth[] | null },
      { data: QrScanTotal[] | null },
    ];

  const membersByGroup = new Map<string, { userId: string; nickname: string }[]>();
  for (const m of members ?? []) {
    if (!membersByGroup.has(m.group_id)) membersByGroup.set(m.group_id, []);
    membersByGroup.get(m.group_id)!.push({ userId: m.user_id, nickname: m.nickname });
  }

  return (
    <>
      <h1 className="text-[34px] font-extrabold tracking-[-0.03em] text-espresso-950">Admin tools</h1>

      <div className="grid grid-cols-2 items-start gap-5">
        <Card>
          <CardHeader>
            <h2 className="mb-1 text-lg font-bold tracking-[-0.015em] text-espresso-950">Send a test notification</h2>
            <p className="text-[13.5px] leading-[1.55] text-espresso-500">
              Pushes a title/body to everyone in a group, or just one person, start from a real notification template or write your
              own, for trying out ad/marketing copy on real devices.
            </p>
          </CardHeader>
          <AdminBroadcastForm
            groups={(groups ?? []).map((g) => ({
              id: g.id,
              name: g.name,
              memberCount: g.member_count,
              members: membersByGroup.get(g.id) ?? [],
            }))}
          />
        </Card>

        <Card>
          <CardHeader>
            <h2 className="mb-1 text-lg font-bold tracking-[-0.015em] text-espresso-950">New public group</h2>
            <p className="text-[13.5px] leading-[1.55] text-espresso-500">
              Always-on, browse-and-join from the directory. You become its owner and first member.
            </p>
          </CardHeader>
          <CreatePublicGroupForm />
        </Card>
      </div>

      <Card id="groups" className="scroll-mt-8">
        <CardHeader>
          <h2 className="mb-1 text-lg font-bold tracking-[-0.015em] text-espresso-950">Public groups &amp; moderators</h2>
          <p className="text-[13.5px] text-espresso-500">A moderator can hand-create a market and void a bad one, without full owner access.</p>
        </CardHeader>
        {(publicGroups ?? []).length === 0 ? (
          <p className="text-sm text-espresso-400">No public groups yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            {(publicGroups ?? []).map((g) => (
              <ManageModeratorsPanel key={g.id} group={{ id: g.id, name: g.name, category: g.category, memberCount: g.member_count }} />
            ))}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-2 items-start gap-5">
        <Card id="pipelines" className="scroll-mt-8">
          <CardHeader>
            <h2 className="mb-1 text-lg font-bold tracking-[-0.015em] text-espresso-950">Auto-generated market pipelines</h2>
            <p className="text-[13.5px] leading-[1.55] text-espresso-500">
              One switch per pipeline covers both its jobs: creating new markets on schedule and resolving ones that have finished. Off
              means every scheduled run no-ops immediately. Markets already created sit unresolved until it&apos;s back on. Flipping
              either way asks for confirmation first.
            </p>
          </CardHeader>
          <AdminPipelineTogglesForm settings={pipelineSettings ?? []} health={pipelineHealth ?? []} />
        </Card>

        <Card>
          <CardHeader>
            <h2 className="mb-1 text-lg font-bold tracking-[-0.015em] text-espresso-950">QR scan totals</h2>
            <p className="text-[13.5px] leading-[1.55] text-espresso-500">
              Printed cards all scan as <span className="font-mono">card</span>; location-specific NFC tags get their own batch (e.g.{' '}
              <span className="font-mono">rutgers</span>). Logged before install, so this counts scans, not signups.
            </p>
          </CardHeader>
          <QrScanTotalsCard totals={qrScanTotals ?? []} />
        </Card>
      </div>
    </>
  );
}
