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
    // Navigation/action wiring can be connected to the corresponding
    // CRM workflows without changing this dashboard contract.
    console.info(`Quick action selected: ${action}`);
  }, []);

  return (
    <section
      aria-labelledby="quick-actions-heading"
      className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
    >
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
          Productivity
        </p>

        <h3
          id="quick-actions-heading"
          className="mt-1 text-lg font-bold text-white"
        >
          Quick Actions
        </h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => handleAction(action.label)}
            className="group rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-cyan-500/50 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          >
            <span className="block text-sm font-semibold text-slate-200 transition group-hover:text-white">
              {action.label}
            </span>

            <span className="mt-1 block text-xs leading-5 text-slate-500 group-hover:text-slate-400">
              {action.description}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}