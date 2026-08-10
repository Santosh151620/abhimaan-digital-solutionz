"use client";

import type { CRMAnalytics } from "@/services/analytics";
import type { WorkflowSnapshot } from "@/services/crm/workflow-intelligence";

type PriorityAlertsCardProps = {
  metrics: CRMAnalytics;
  workflow: WorkflowSnapshot;
};

type AlertTone = "critical" | "warning" | "info";

type AlertItem = {
  id: string;
  title: string;
  description: string;
  tone: AlertTone;
  count?: number;
};

function formatNumber(value: number): string {
  return Number.isFinite(value) ? value.toLocaleString("en-IN") : "0";
}

function toneClasses(tone: AlertTone): {
  container: string;
  indicator: string;
  count: string;
} {
  switch (tone) {
    case "critical":
      return {
        container:
          "border-rose-500/15 bg-rose-500/[0.04] hover:border-rose-500/25",
        indicator: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.45)]",
        count: "text-rose-400",
      };

    case "warning":
      return {
        container:
          "border-amber-500/15 bg-amber-500/[0.04] hover:border-amber-500/25",
        indicator: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.45)]",
        count: "text-amber-400",
      };

    default:
      return {
        container:
          "border-cyan-500/15 bg-cyan-500/[0.04] hover:border-cyan-500/25",
        indicator: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.45)]",
        count: "text-cyan-400",
      };
  }
}

function AlertRow({ alert }: { alert: AlertItem }) {
  const classes = toneClasses(alert.tone);

  return (
    <div
      className={`rounded-xl border px-3.5 py-3 transition-colors duration-200 ${classes.container}`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          aria-hidden="true"
          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${classes.indicator}`}
        />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-200">
            {alert.title}
          </p>

          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {alert.description}
          </p>
        </div>

        {typeof alert.count === "number" && (
          <span
            className={`shrink-0 text-sm font-bold ${classes.count}`}
          >
            {formatNumber(alert.count)}
          </span>
        )}
      </div>
    </div>
  );
}

export default function PriorityAlertsCard({
  metrics,
  workflow,
}: PriorityAlertsCardProps) {
  const overduePayments = metrics.payments.overdue;
  const urgentFollowUps = workflow.copilot.followUpUrgent.length;
  const inactiveLeads = workflow.inactiveLeads.length;
  const newLeads = metrics.overview.newLeads;
  const proposalLeads = metrics.overview.proposalLeads;

  const alerts: AlertItem[] = [];

  if (overduePayments > 0) {
    alerts.push({
      id: "overdue-payments",
      title: "Overdue payments require attention",
      description:
        "Review outstanding payment items and follow up with affected customers.",
      tone: "critical",
      count: overduePayments,
    });
  }

  if (urgentFollowUps > 0) {
    alerts.push({
      id: "urgent-follow-ups",
      title: "Urgent lead follow-ups available",
      description:
        "Inactive or high-priority leads have been identified for follow-up.",
      tone: "warning",
      count: urgentFollowUps,
    });
  } else if (inactiveLeads > 0) {
    alerts.push({
      id: "inactive-leads",
      title: "Inactive leads need review",
      description:
        "Some leads have become inactive and may require renewed engagement.",
      tone: "warning",
      count: inactiveLeads,
    });
  }

  if (newLeads > 0) {
    alerts.push({
      id: "new-leads",
      title: "New leads are ready",
      description:
        "Newly captured leads are available for qualification and follow-up.",
      tone: "info",
      count: newLeads,
    });
  }

  if (proposalLeads > 0) {
    alerts.push({
      id: "proposal-leads",
      title: "Proposal opportunities need review",
      description:
        "Leads currently in proposal stage should be reviewed for next action.",
      tone: "info",
      count: proposalLeads,
    });
  }

  const visibleAlerts = alerts.slice(0, 4);

  const hasCriticalAlert = visibleAlerts.some(
    (alert) => alert.tone === "critical",
  );

  return (
    <section
      aria-labelledby="priority-alerts-title"
      className="min-w-0 rounded-2xl border border-amber-500/20 bg-slate-900 p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/30 hover:shadow-xl hover:shadow-amber-950/10 sm:p-6"
    >
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-400">
            Executive Alerts
          </p>

          <h2
            id="priority-alerts-title"
            className="mt-1.5 truncate text-base font-semibold tracking-tight text-white sm:text-lg"
          >
            Priority Alerts
          </h2>

          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Current issues and opportunities requiring attention.
          </p>
        </div>

        <span
          aria-label={
            hasCriticalAlert
              ? "Critical alert present"
              : visibleAlerts.length > 0
                ? "Priority alerts available"
                : "No priority alerts"
          }
          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
            hasCriticalAlert
              ? "bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.45)]"
              : visibleAlerts.length > 0
                ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.45)]"
                : "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]"
          }`}
        />
      </div>

      <div className="mt-5 space-y-2.5">
        {visibleAlerts.length > 0 ? (
          visibleAlerts.map((alert) => (
            <AlertRow key={alert.id} alert={alert} />
          ))
        ) : (
          <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] px-4 py-4">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-bold text-emerald-400"
              >
                ✓
              </span>

              <div>
                <p className="text-sm font-semibold text-slate-200">
                  No priority alerts
                </p>

                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  There are currently no critical issues or priority actions
                  detected by the dashboard intelligence.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-800/80 pt-4">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
            New Leads
          </p>

          <p className="mt-1 text-sm font-semibold text-sky-400">
            {formatNumber(newLeads)}
          </p>
        </div>

        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
            Proposals
          </p>

          <p className="mt-1 text-sm font-semibold text-violet-400">
            {formatNumber(proposalLeads)}
          </p>
        </div>

        <div className="min-w-0">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
            Overdue
          </p>

          <p
            className={`mt-1 text-sm font-semibold ${
              overduePayments > 0 ? "text-rose-400" : "text-emerald-400"
            }`}
          >
            {formatNumber(overduePayments)}
          </p>
        </div>
      </div>
    </section>
  );
}
