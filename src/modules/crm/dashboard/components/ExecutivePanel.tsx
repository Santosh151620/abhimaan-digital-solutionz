import KPICard from "@/modules/dashboard/components/KPICard";
import type {
  ExecutiveSnapshot,
  ExecutiveAction,
  ExecutiveAlert,
} from "../services/executive-intelligence";

interface Props {
  executive: ExecutiveSnapshot;
}

const alertColors: Record<ExecutiveAlert["severity"], string> = {
  high: "border-red-400/20 bg-red-400/5 text-red-300",
  medium: "border-amber-400/20 bg-amber-400/5 text-amber-300",
  low: "border-slate-700 bg-slate-800/40 text-slate-400",
};

const actionColors: Record<ExecutiveAction["priority"], string> = {
  high: "border-red-400/20 bg-red-400/5 text-red-300",
  medium: "border-amber-400/20 bg-amber-400/5 text-amber-300",
  low: "border-emerald-400/20 bg-emerald-400/5 text-emerald-300",
};

function formatMomentum(value: string | undefined): string {
  if (!value) {
    return "No assessment";
  }

  return value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function ExecutivePanel({ executive }: Props) {
  const summary =
    executive.summary?.trim() || "Executive intelligence is currently unavailable.";

  const alerts = Array.isArray(executive.alerts) ? executive.alerts : [];
  const actions = Array.isArray(executive.actions) ? executive.actions : [];

  return (
    <section
      aria-labelledby="executive-intelligence-title"
      className="min-w-0 space-y-5"
    >
      <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/70 p-5 shadow-lg shadow-black/10 sm:p-6">
        <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
              Leadership Intelligence
            </p>

            <h2
              id="executive-intelligence-title"
              className="mt-1.5 text-xl font-semibold tracking-tight text-white sm:text-2xl"
            >
              Executive Intelligence
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              {summary}
            </p>
          </div>

          <KPICard
            title="Business Momentum"
            value={formatMomentum(executive.momentum)}
            valueClassName="text-cyan-400"
            className="w-full shrink-0 lg:w-[230px]"
          />
        </div>
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-white">
              Executive Alerts
            </h3>

            <span className="rounded-full border border-slate-800 bg-slate-950 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
              {alerts.length}
            </span>
          </div>

          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 px-4 py-6 text-center">
                <p className="text-sm font-medium text-slate-500">
                  No executive alerts
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  No priority signals require executive attention right now.
                </p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex min-w-0 items-start justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-3.5"
                >
                  <span className="min-w-0 text-sm font-medium text-slate-200">
                    {alert.title}
                  </span>

                  <span
                    className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${alertColors[alert.severity]}`}
                  >
                    {alert.severity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-white">
              Recommended Actions
            </h3>

            <span className="rounded-full border border-slate-800 bg-slate-950 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
              {actions.length}
            </span>
          </div>

          <div className="space-y-3">
            {actions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 px-4 py-6 text-center">
                <p className="text-sm font-medium text-slate-500">
                  No recommended actions
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Recommended executive actions will appear as new signals are detected.
                </p>
              </div>
            ) : (
              actions.map((action) => (
                <div
                  key={action.id}
                  className="flex min-w-0 items-start justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-3.5"
                >
                  <span className="min-w-0 text-sm font-medium text-slate-200">
                    {action.title}
                  </span>

                  <span
                    className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${actionColors[action.priority]}`}
                  >
                    {action.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
