"use client";

type MetricProps = {
  label: string;
  value: string;
};

const metrics: MetricProps[] = [
  { label: "Leads", value: "—" },
  { label: "Clients", value: "—" },
  { label: "Projects", value: "—" },
  { label: "Revenue", value: "—" },
];

export default function ExecutiveSummaryCard() {
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
        {metrics.map((metric) => (
          <Metric
            key={metric.label}
            label={metric.label}
            value={metric.value}
          />
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-3.5 transition-colors duration-200 hover:border-slate-700 hover:bg-slate-900 sm:px-4">
      <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>

      <p className="mt-1.5 truncate text-xl font-bold tracking-tight text-white sm:text-2xl">
        {value}
      </p>
    </div>
  );
}
