import KPICard from "@/modules/dashboard/components/KPICard";
import type { RevenueSnapshot } from "@/services/crm/revenue-intelligence";

interface Props {
  data: RevenueSnapshot;
}

export default function RevenueKPI({
  data,
}: Props) {
  return (
    <section className="grid gap-4 md:grid-cols-4">

      <KPICard
        title="Collection Rate"
        value={`${data.collectionRate}%`}
        valueClassName="text-emerald-400"
      />

      <KPICard
        title="Paid Payments"
        value={data.paidPayments}
        valueClassName="text-green-400"
      />

      <KPICard
        title="Pending Payments"
        value={data.pendingPayments}
        valueClassName="text-yellow-400"
      />

      <KPICard
        title="Overdue Payments"
        value={data.overduePayments}
        valueClassName="text-red-400"
      />

    </section>
  );
}