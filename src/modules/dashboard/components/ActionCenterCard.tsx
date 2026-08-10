"use client";

type ActionState = "clear" | "attention";

type ActionCenterCardProps = {
  state?: ActionState;
  message?: string;
  metrics?: {
    totalLeads?: number | null;
    newLeads?: number | null;
    qualifiedLeads?: number | null;
    proposalLeads?: number | null;
    overduePayments?: number | null;
  } | null;
};

function formatNumber(value: number | null | undefined): string {
  return typeof value === "number" && Number.isFinite(value)
    ? value.toLocaleString("en-IN")
    : "0";
}

function resolveActionState(
  state: ActionState | undefined,
  metrics: ActionCenterCardProps["metrics"],
): ActionState {
  if (state) {
    return state;
  }

  if ((metrics?.overduePayments ?? 0) > 0) {
    return "attention";
  }

  return "clear";
}

function buildMessage(
  state: ActionState,
  metrics: ActionCenterCardProps["metrics"],
): string {
  if (state === "attention") {
    const overdue = metrics?.overduePayments ?? 0;

    if (overdue > 0) {
      return `${formatNumber(overdue)} overdue payment${
        overdue === 1 ? "" : "s"
      } require${overdue === 1 ? "s" : ""} attention.`;
    }

    return "Some CRM activities require attention.";
  }

  const newLeads = metrics?.newLeads ?? 0;

  if (newLeads > 0) {
    return `${formatNumber(newLeads)} new lead${
      newLeads === 1 ? "" : "s"
    } are ready for follow-up.`;
  }

  return "No critical actions detected.";
}

export default function ActionCenterCard({
  state,
  message,
  metrics,
}: ActionCenterCardProps) {
  const resolvedState = resolveActionState(state, metrics);
  const isClear = resolvedState === "clear";

  const resolvedMessage =
    typeof message === "string" && message.trim().length > 0
      ? message
      : buildMessage(resolvedState, metrics);

  const title =
    resolvedState === "attention"
      ? "Attention Required"
      : "Attention Required";

  return (
    <section
      aria-labelledby="action-center-title"
      className="min-w-0 rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/20 hover:shadow-xl hover:shadow-amber-950/10 sm:p-6"
    >
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-400">
            Action Center
          </p>

          <h2
            id="action-center-title"
            className="mt-1.5 truncate text-base font-semibold tracking-tight text-white sm:text-lg"
          >
            {title}
          </h2>

          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Priority actions and operational attention points.
          </p>
        </div>

        <span
          aria-label={
            isClear
              ? "No critical actions"
              : "Actions require attention"
          }
          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
            isClear
              ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]"
              : "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.45)]"
          }`}
        />
      </div>

      <div
        className={`mt-5 rounded-xl border px-4 py-3.5 ${
          isClear
            ? "border-emerald-500/10 bg-emerald-500/[0.04]"
            : "border-amber-500/10 bg-amber-500/[0.04]"
        }`}
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              isClear
                ? "bg-emerald-400/10 text-emerald-400"
                : "bg-amber-400/10 text-amber-400"
            }`}
          >
            {isClear ? "✓" : "!"}
          </span>

          <p className="min-w-0 text-sm leading-relaxed text-slate-300">
            {resolvedMessage}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800/80 pt-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            New Leads
          </p>

          <p className="mt-1 text-sm font-semibold text-sky-400">
            {formatNumber(metrics?.newLeads)}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Proposals
          </p>

          <p className="mt-1 text-sm font-semibold text-violet-400">
            {formatNumber(metrics?.proposalLeads)}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Qualified
          </p>

          <p className="mt-1 text-sm font-semibold text-cyan-400">
            {formatNumber(metrics?.qualifiedLeads)}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Overdue
          </p>

          <p
            className={`mt-1 text-sm font-semibold ${
              (metrics?.overduePayments ?? 0) > 0
                ? "text-rose-400"
                : "text-emerald-400"
            }`}
          >
            {formatNumber(metrics?.overduePayments)}
          </p>
        </div>
      </div>
    </section>
  );
}
