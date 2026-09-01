import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/requireAdmin';
import { Card, CardHeader } from '@/components/ui/Card';
import { GroupDetailHeader } from '@/components/groups/GroupDetailHeader';
import { GroupRoster } from '@/components/groups/GroupRoster';
import { GroupActivityTimeline } from '@/components/groups/GroupActivityTimeline';
import { GroupSeasonHistory } from '@/components/groups/GroupSeasonHistory';
import { CaretLeftIcon } from '@/components/ui/icons';
import { getGroupDetail, getGroupRoster, getGroupActivityTimeline, getGroupSeasonHistory } from '@/lib/actions/groupDetail';

export default async function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const [detail, roster, timeline, seasons] = await Promise.all([
    getGroupDetail(id),
    getGroupRoster(id),
    getGroupActivityTimeline(id, 90),
    getGroupSeasonHistory(id),
  ]);

  if (detail.error || !detail.data) {
    notFound();
  }

  return (
    <>
      <Link href="/groups" className="inline-flex w-fit items-center gap-1.5 text-[13px] font-bold text-espresso-500 hover:text-espresso-800">
        <CaretLeftIcon className="h-3.5 w-3.5" />
        All groups
      </Link>

      <GroupDetailHeader group={detail.data} />

      <div className="grid grid-cols-[1.3fr_1fr] items-start gap-5">
        <Card>
          <CardHeader>
            <h2 className="text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">Activity, last 90 days</h2>
          </CardHeader>
          {timeline.error ? <p className="text-sm text-danger-700">{timeline.error}</p> : <GroupActivityTimeline days={timeline.data ?? []} />}
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">Season history</h2>
            <p className="mt-[3px] text-[12.5px] text-espresso-400">Read straight from each season&apos;s frozen snapshot.</p>
          </CardHeader>
          {seasons.error ? <p className="text-sm text-danger-700">{seasons.error}</p> : <GroupSeasonHistory seasons={seasons.data ?? []} />}
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-[11px] font-bold tracking-[0.14em] text-espresso-400 uppercase">Roster</h2>
        </CardHeader>
        {roster.error ? <p className="text-sm text-danger-700">{roster.error}</p> : <GroupRoster rows={roster.data ?? []} />}
      </Card>
    </>
  );
}
