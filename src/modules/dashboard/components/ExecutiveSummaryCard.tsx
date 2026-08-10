import type { CRMAnalytics } from "@/services/analytics";

type ExecutiveSummaryCardProps = {
  metrics: CRMAnalytics;
};

function formatCount(value: number | undefined): string {
  return typeof value === "number" && Number.isFinite(value)
    ? value.toLocaleString("en-IN")
    : "—";
}

function formatRevenue(value: number | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ExecutiveSummaryCard({
  metrics,
}: ExecutiveSummaryCardProps) {
  const items = [
    {
      label: "Leads",
      value: formatCount(metrics.overview.totalLeads),
    },
    {
      label: "Clients",
      value: formatCount(metrics.overview.activeClients),
    },
    {
      label: "Projects",
      value: formatCount(metrics.overview.activeProjects),
    },
    {
      label: "Revenue",
      value: formatRevenue(metrics.revenue.totalRevenue),
    },
  ];

  return (
    <section
      aria-labelledby="executive-summary-title"
      className="group min-w-0 rounded-2xl border border-slate-800/90 bg-slate-950/80 p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:shadow-xl hover:shadow-cyan-950/10 sm:p-6"
    >
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
            Executive Overview
          </p>

          <h2
            id="executive-summary-title"
            className="mt-1.5 truncate text-base font-semibold tracking-tight text-white sm:text-lg"
          >
            Executive Summary
          </h2>

          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Current business activity at a glance.
          </p>
        </div>

        <span
          aria-hidden="true"
          className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.45)]"
        />
      </div>

      <div className="mt-5 grid min-w-0 grid-cols-2 gap-3 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="min-w-0 rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-3.5 transition-colors duration-200 hover:border-slate-700 hover:bg-slate-900 sm:px-4"
          >
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              {item.label}
            </p>

            <p className="mt-1.5 truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}