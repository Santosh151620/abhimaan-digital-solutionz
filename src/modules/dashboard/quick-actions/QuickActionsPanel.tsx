"use client";

import { useCallback } from "react";

const actions = [
  {
    label: "New Lead",
    description: "Create a new CRM lead",
  },
  {
    label: "Create Task",
    description: "Add a task for follow-up",
  },
  {
    label: "Schedule Meeting",
    description: "Plan a customer meeting",
  },
  {
    label: "Send Proposal",
    description: "Prepare a proposal",
  },
  {
    label: "Import Leads",
    description: "Import leads into CRM",
  },
  {
    label: "Export CRM",
    description: "Export CRM data",
  },
] as const;

export default function QuickActionsPanel() {
  const handleAction = useCallback((action: string) => {
    console.info(`[CRM] Quick action selected: ${action}`);
  }, []);

  return (
    <section
      aria-labelledby="quick-actions-heading"
      className="min-w-0 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 shadow-lg shadow-black/10"
    >
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
          Productivity
        </p>

        <h3
          id="quick-actions-heading"
          className="mt-1 text-base font-semibold text-white"
        >
          Quick Actions
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Start common CRM workflows from the dashboard.
        </p>
      </div>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => handleAction(action.label)}
            className="group min-w-0 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3.5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-cyan-500/30 hover:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <span className="block truncate text-sm font-semibold text-slate-200 transition-colors group-hover:text-white">
              {action.label}
            </span>

            <span className="mt-1 block text-xs leading-5 text-slate-500 transition-colors group-hover:text-slate-400">
              {action.description}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
