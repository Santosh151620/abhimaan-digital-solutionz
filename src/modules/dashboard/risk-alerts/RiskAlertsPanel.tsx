"use client";

import { riskAlerts } from "./data";

function getSeverityClass(severity: unknown): string {
  const normalized = String(severity).toLowerCase();

  if (normalized === "high" || normalized === "critical") {
    return "border-red-500/20 bg-red-500/10 text-red-300";
  }

  if (normalized === "medium" || normalized === "warning") {
    return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  }

  return "border-slate-700 bg-slate-800/50 text-slate-400";
}

export default function RiskAlertsPanel() {
  return (
    <section
      aria-labelledby="risk-alerts-heading"
      className="min-w-0 overflow-hidden rounded-2xl border border-amber-500/15 bg-slate-900/70 p-5 shadow-lg shadow-black/10"
    >
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
          Risk Monitoring
        </p>

        <h3
          id="risk-alerts-heading"
          className="mt-1 text-base font-semibold text-white"
        >
          Risk Alerts
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Business conditions requiring attention or follow-up.
        </p>
      </div>

      {riskAlerts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 px-4 py-7 text-center">
          <p className="text-sm text-slate-400">
            No active risk alerts.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {riskAlerts.map((alert) => (
            <article
              key={alert.title}
              className="min-w-0 rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 transition-colors hover:border-amber-500/20"
            >
              <div className="flex items-start justify-between gap-4">
                <h4 className="min-w-0 text-sm font-semibold text-white">
                  {alert.title}
                </h4>

                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${getSeverityClass(
                    alert.severity,
                  )}`}
                >
                  {alert.severity}
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {alert.detail}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
