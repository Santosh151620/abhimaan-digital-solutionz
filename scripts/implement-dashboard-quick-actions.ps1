$ErrorActionPreference="Stop"

$root=(Get-Location).Path
$dir=Join-Path $root "src\modules\dashboard\quick-actions"

@'
"use client";

const actions = [
  "New Lead",
  "Create Task",
  "Schedule Meeting",
  "Send Proposal",
  "Import Leads",
  "Export CRM"
];

export default function QuickActionsPanel() {

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h3 className="mb-4 text-lg font-bold text-white">
        Quick Actions
      </h3>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

        {actions.map((item)=>(

          <button
            key={item}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:border-teal-500 hover:text-white"
          >
            {item}
          </button>

        ))}

      </div>
    </section>
  );
}
'@ | Set-Content (Join-Path $dir "QuickActionsPanel.tsx")

@'
export { default as QuickActionsPanel } from "./QuickActionsPanel";
'@ | Set-Content (Join-Path $dir "index.ts")

Write-Host "Quick Actions implemented."