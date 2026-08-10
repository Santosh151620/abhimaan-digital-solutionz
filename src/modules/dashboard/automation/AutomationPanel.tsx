"use client";

import { automationRules } from "./data";

export default function AutomationPanel() {
  return (
    <section
      aria-labelledby="automation-title"
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3
          id="automation-title"
          className="text-lg font-bold text-white"
        >
          CRM Automation Engine
        </h3>

        <span className="text-xs text-slate-500">
          {automationRules.length} rule
          {automationRules.length === 1 ? "" : "s"}
        </span>
      </div>

      {automationRules.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-800 bg-slate-950 p-4 text-sm text-slate-500">
          No automation rules are configured.
        </p>
      ) : (
        <div className="space-y-3">
          {automationRules.map((rule) => (
            <article
              key={rule.title}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-semibold text-white">
                  {rule.title}
                </span>

                <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                  {rule.status}
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {rule.action}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}