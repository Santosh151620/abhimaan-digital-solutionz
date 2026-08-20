import KPICard from "@/modules/dashboard/components/KPICard";
import type { RevenueSnapshot } from "@/services/crm/revenue-intelligence";

interface Props {
  data: RevenueSnapshot;
}

function formatCount(value: unknown): string | number {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "â€”";
  }

  return Math.max(0, numericValue);
}

function formatCollectionRate(value: unknown): string {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "â€”";
  }

  const rate = Math.max(0, Math.min(100, numericValue));

  return `${rate.toFixed(0)}%`;
}

export default function RevenueKPI({ data }: Props) {
  return (
    <section
      aria-label="Revenue performance"
      className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      <KPICard
        title="Collection Rate"
        value={formatCollectionRate(data.collectionRate)}
        valueClassName="text-emerald-400"
      />

      <KPICard
        title="Paid Payments"
        value={formatCount(data.paidPayments)}
        valueClassName="text-green-400"
      />

      <KPICard
        title="Pending Payments"
        value={formatCount(data.pendingPayments)}
        valueClassName="text-amber-400"
      />

      <KPICard
        title="Overdue Payments"
        value={formatCount(data.overduePayments)}
        valueClassName="text-red-400"
      />
    </section>
  );
}
