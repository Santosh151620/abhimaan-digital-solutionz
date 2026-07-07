$root = Get-Location

$dashboard = "$root\src\modules\dashboard\components"

New-Item -ItemType Directory -Force -Path $dashboard | Out-Null

@"
"use client";

export default function ExecutiveSummaryCard() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
      <h2 className="text-lg font-semibold text-white">
        Executive Summary
      </h2>

      <div className="mt-4 grid gap-4 md:grid-cols-4">
        <Metric label="Leads" value="--" />
        <Metric label="Clients" value="--" />
        <Metric label="Projects" value="--" />
        <Metric label="Revenue" value="--" />
      </div>
    </div>
  );
}

function Metric({label,value}:{label:string;value:string}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-xs text-slate-500 uppercase">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
"@ | Set-Content "$dashboard\ExecutiveSummaryCard.tsx"


@"
"use client";

export default function CRMHealthCard() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
      <h2 className="text-lg font-semibold text-white">
        CRM Health
      </h2>

      <div className="mt-4 space-y-3 text-sm text-slate-300">
        <p>? Lead pipeline active</p>
        <p>? Customer data connected</p>
        <p>? Workflow engine available</p>
      </div>
    </div>
  );
}
"@ | Set-Content "$dashboard\CRMHealthCard.tsx"


@"
"use client";

export default function PipelineIntelligenceCard() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
      <h2 className="text-lg font-semibold text-white">
        Pipeline Intelligence
      </h2>

      <p className="mt-4 text-slate-400">
        Track opportunities, conversion trends and sales movement.
      </p>
    </div>
  );
}
"@ | Set-Content "$dashboard\PipelineIntelligenceCard.tsx"


@"
"use client";

export default function ActionCenterCard() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
      <h2 className="text-lg font-semibold text-white">
        Attention Required
      </h2>

      <p className="mt-4 text-slate-400">
        No critical actions detected.
      </p>
    </div>
  );
}
"@ | Set-Content "$dashboard\ActionCenterCard.tsx"

Write-Host "Dashboard Intelligence Components Created"
