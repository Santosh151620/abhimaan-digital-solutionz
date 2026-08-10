"use client";

type PipelineStage = {
  name?: string | null;
  count?: number | null;
  value?: number | null;
};

type PipelineMetrics = {
  totalLeads?: number | null;
  qualifiedLeads?: number | null;
  proposalLeads?: number | null;
  wonLeads?: number | null;
  conversionRate?: number | null;
};

type PipelineIntelligenceCardProps = {
  metrics?: PipelineMetrics | null;
  stages?: readonly PipelineStage[] | null;
};

function formatNumber(value: number | null | undefined): string {
  return typeof value === "number" && Number.isFinite(value)
    ? value.toLocaleString("en-IN")
    : "0";
}

function formatCurrency(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizeStages(
  stages: readonly PipelineStage[] | null | undefined,
): readonly PipelineStage[] {
  return Array.isArray(stages) ? stages : [];
}

export default function PipelineIntelligenceCard({
  metrics,
  stages,
}: PipelineIntelligenceCardProps) {
  const safeStages = normalizeStages(stages);

  const totalOpportunities =
    safeStages.length > 0
      ? safeStages.reduce(
          (total, stage) => total + (stage.count ?? 0),
          0,
        )
      : metrics?.totalLeads ?? 0;

  const totalPipelineValue = safeStages.reduce(
    (total, stage) => total + (stage.value ?? 0),
    0,
  );

  const qualifiedLeads = metrics?.qualifiedLeads ?? 0;
  const proposalLeads = metrics?.proposalLeads ?? 0;
  const wonLeads = metrics?.wonLeads ?? 0;
  const conversionRate = metrics?.conversionRate ?? 0;

  return (
    <section
      aria-labelledby="pipeline-intelligence-title"
      className="min-w-0 rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/20 hover:shadow-xl hover:shadow-cyan-950/10 sm:p-6"
    >
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
            Sales Pipeline
          </p>

          <h2
            id="pipeline-intelligence-title"
            className="mt-1.5 truncate text-base font-semibold tracking-tight text-white sm:text-lg"
          >
            Pipeline Intelligence
          </h2>

          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Opportunities, qualification, proposals and conversion performance.
          </p>
        </div>

        <span
          aria-hidden="true"
          className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.45)]"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Metric
          label="Opportunities"
          value={formatNumber(totalOpportunities)}
        />

        <Metric
          label="Pipeline Value"
          value={formatCurrency(totalPipelineValue)}
          valueClassName="text-cyan-400"
        />

        <Metric
          label="Qualified"
          value={formatNumber(qualifiedLeads)}
          valueClassName="text-violet-400"
        />

        <Metric
          label="Proposals"
          value={formatNumber(proposalLeads)}
          valueClassName="text-sky-400"
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <Metric
          label="Won"
          value={formatNumber(wonLeads)}
          valueClassName="text-emerald-400"
        />

        <Metric
          label="Conversion"
          value={`${conversionRate}%`}
          valueClassName="text-emerald-400"
        />
      </div>

      {safeStages.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Pipeline Stages
          </p>

          {safeStages.slice(0, 4).map((stage, index) => (
            <div
              key={`${stage.name ?? "stage"}-${index}`}
              className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-800/60 bg-slate-900/40 px-3 py-2"
            >
              <span className="min-w-0 flex-1 truncate text-xs text-slate-400">
                {stage.name ?? `Stage ${index + 1}`}
              </span>

              <span className="shrink-0 text-xs font-semibold text-white">
                {formatNumber(stage.count)}
              </span>

              {typeof stage.value === "number" &&
                Number.isFinite(stage.value) && (
                  <span className="hidden shrink-0 text-xs text-slate-500 sm:block">
                    {formatCurrency(stage.value)}
                  </span>
                )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

type MetricProps = {
  label: string;
  value: string;
  valueClassName?: string;
};

function Metric({
  label,
  value,
  valueClassName = "text-white",
}: MetricProps) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-3.5 sm:px-4">
      <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1.5 truncate text-xl font-bold tracking-tight sm:text-2xl ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}
