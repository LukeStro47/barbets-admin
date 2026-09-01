import type { MembershipChurn } from '@/lib/actions/users';

export function MembershipChurnCard({ churn }: { churn: MembershipChurn }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-danger-100 bg-paper-white p-[16px]">
          <p className="text-[28px] leading-none font-extrabold tracking-[-0.02em] text-danger-700">
            {churn.early_churn_rate === null ? '—' : `${churn.early_churn_rate}%`}
          </p>
          <p className="mt-1.5 text-[11px] font-bold tracking-[0.08em] text-espresso-400 uppercase">Early churn</p>
          <p className="mt-1 text-[12px] text-espresso-500">{churn.early_churn} left within 7 days of joining</p>
        </div>
        <div className="rounded-2xl border border-honey-100 bg-paper-white p-[16px]">
          <p className="text-[28px] leading-none font-extrabold tracking-[-0.02em] text-honey-800">
            {churn.late_churn_rate === null ? '—' : `${churn.late_churn_rate}%`}
          </p>
          <p className="mt-1.5 text-[11px] font-bold tracking-[0.08em] text-espresso-400 uppercase">Late churn</p>
          <p className="mt-1 text-[12px] text-espresso-500">{churn.late_churn} left after 7+ days</p>
        </div>
      </div>
      <p className="text-[12.5px] text-espresso-400">
        {churn.total_joins} joins in this window &middot; {churn.still_here} still active or dormant
      </p>
    </div>
  );
}
