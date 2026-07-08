$ErrorActionPreference="Stop"

$dir="src\modules\dashboard\ai-score"

if (!(Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

@'
export const aiScore = {
  score:87,
  label:"Healthy",
  factors:[
    "Pipeline momentum",
    "Lead engagement",
    "Revenue consistency",
    "Operational efficiency"
  ]
};
'@ | Set-Content "$dir\data.ts"


@'
"use client";

import { aiScore } from "./data";

export default function AIScorePanel(){

  return (

    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <h3 className="mb-4 text-lg font-bold text-white">
        AI Business Score
      </h3>

      <div className="flex items-center gap-6">

        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-teal-500/40 bg-slate-950">

          <span className="text-3xl font-black text-teal-400">
            {aiScore.score}
          </span>

        </div>

        <div>

          <p className="font-semibold text-white">
            {aiScore.label}
          </p>

          <div className="mt-2 space-y-1">

            {aiScore.factors.map((factor)=>(

              <p
                key={factor}
                className="text-sm text-slate-400"
              >
                ✓ {factor}
              </p>

            ))}

          </div>

        </div>

      </div>

    </section>

  );

}
'@ | Set-Content "$dir\AIScorePanel.tsx"


@'
export { default as AIScorePanel } from "./AIScorePanel";
'@ | Set-Content "$dir\index.ts"


Write-Host "AI Score implemented."