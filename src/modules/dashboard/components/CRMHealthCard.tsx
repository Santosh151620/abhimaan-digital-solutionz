"use client";

import type { CRMAnalytics } from "@/services/analytics";

type CRMHealthCardProps = {
  metrics?: CRMAnalytics | null;
};

type HealthStatus = {
  label: string;
  description: string;
  tone: "success" | "warning" | "danger" | "neutral";
};

function formatNumber(value: number | undefined): string {
  return typeof value === "number" && Number.isFinite(value)
    ? value.toLocaleString("en-IN")
    : "0";
}

function formatPercentage(value: number | undefined): string {
  return typeof value === "number" && Number.isFinite(value)
    ? `${value.toFixed(1)}%`
    : "0%";
}

function getToneClasses(tone: HealthStatus["tone"]): string {
  switch (tone) {
    case "success":
      return "border-emerald-500/15 bg-emerald-500/[0.04] text-emerald-400";

    case "warning":
      return "border-amber-500/15 bg-amber-500/[0.04] text-amber-400";

    case "danger":
      return "border-rose-500/15 bg-rose-500/[0.04] text-rose-400";

    default:
      return "border-slate-800 bg-slate-900/50 text-slate-400";
  }
}

function getPipelineStatus(
  health: CRMAnalytics["health"]["pipeline"] | undefined,
): HealthStatus {
  switch (health) {
    case "healthy":
      return {
        label: "Healthy",
        description: "Lead pipeline is performing normally.",
        tone: "success",
      };

    case "warning":
      return {
        label: "Needs attention",
        description: "Pipeline activity should be reviewed.",
        tone: "warning",
      };

    case "critical":
      return {
        label: "Critical",
        description: "Pipeline requires immediate attention.",
        tone: "danger",
      };

    default:
      return {
        label: "Monitoring",
        description: "Pipeline health data is being evaluated.",
        tone: "neutral",
      };
  }
}

function getRevenueStatus(
  health: CRMAnalytics["health"]["revenue"] | undefined,
): HealthStatus {
  switch (health) {
    case "excellent":
      return {
        label: "Excellent",
        description: "Revenue collection is performing strongly.",
        tone: "success",
      };

    case "good":
      return {
        label: "Good",
        description: "Revenue performance is within a healthy range.",
        tone: "success",
      };

    case "warning":
      return {
        label: "Warning",
        description: "Revenue collection requires monitoring.",
        tone: "warning",
      };

    case "critical":
      return {
        label: "Critical",
        description: "Revenue performance requires attention.",
        tone: "danger",
      };

    default:
      return {
        label: "Monitoring",
        description: "Revenue health data is being evaluated.",
        tone: "neutral",
      };
  }
}

function StatusRow({
  label,
  status,
}: {
  label: string;
  status: HealthStatus;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-3 ${getToneClasses(status.tone)}`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${status.tone === "success"
              ? "bg-emerald-400"
              : status.tone === "warning"
                ? "bg-amber-400"
                : status.tone === "danger"
                  ? "bg-rose-400"
                  : "bg-slate-500"
            }`}
        />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-xs font-semibold text-slate-200">{label}</p>

            <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
              {status.label}
            </span>
          </div>

          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {status.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CRMHealthCard({
  metrics,
}: CRMHealthCardProps) {
  const overview = metrics?.overview;
  const health = metrics?.health;

  const pipelineStatus = getPipelineStatus(health?.pipeline);
  const revenueStatus = getRevenueStatus(health?.revenue);

  return (
    <section
      aria-labelledby="crm-health-title"
      className="min-w-0 rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/20 hover:shadow-xl hover:shadow-emerald-950/10 sm:p-6"
    >
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">
            Platform Health
          </p>

          <h2
            id="crm-health-title"
            className="mt-1.5 truncate text-base font-semibold tracking-tight text-white sm:text-lg"
          >
            CRM Health
          </h2>

          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Current CRM activity, pipeline and customer health.
          </p>
        </div>

        <span
          aria-hidden="true"
          className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-3.5 sm:px-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Active Clients
          </p>

          <p className="mt-1.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
            {formatNumber(overview?.activeClients)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-3.5 sm:px-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Active Projects
          </p>

          <p className="mt-1.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
            {formatNumber(overview?.activeProjects)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-3.5 sm:px-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Qualified Leads
          </p>

          <p className="mt-1.5 text-xl font-bold tracking-tight text-violet-400 sm:text-2xl">
            {formatNumber(overview?.qualifiedLeads)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 px-3 py-3.5 sm:px-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Conversion
          </p>

          <p className="mt-1.5 text-xl font-bold tracking-tight text-cyan-400 sm:text-2xl">
            {formatPercentage(overview?.conversionRate)}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <StatusRow
          label="Pipeline"
          status={pipelineStatus}
        />

        <StatusRow
          label="Revenue"
          status={revenueStatus}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800/80 pt-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Total Leads
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            {formatNumber(overview?.totalLeads)}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Won Leads
          </p>

          <p className="mt-1 text-sm font-semibold text-emerald-400">
            {formatNumber(overview?.wonLeads)}
          </p>
        </div>
      </div>

    </section>
  );
}
