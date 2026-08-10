"use client";

import { BrainCircuit, CheckCircle2, Gauge } from "lucide-react";

import { aiScore } from "./data";

export default function AIScorePanel() {
  const score = Math.max(0, Math.min(100, Number(aiScore.score) || 0));

  return (
    <section
      aria-labelledby="ai-business-score-title"
      className="min-w-0 rounded-2xl border border-cyan-400/10 bg-slate-950/55 p-4 transition-colors hover:border-cyan-400/20 sm:p-5"
    >
      <div className="flex items-center gap-2.5">
        <div
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/5"
        >
          <BrainCircuit className="h-4 w-4 text-cyan-300" />
        </div>

        <div className="min-w-0">
          <h3
            id="ai-business-score-title"
            className="truncate text-sm font-semibold text-white"
          >
            AI Business Score
          </h3>

          <p className="text-[11px] text-slate-500">
            Overall business intelligence signal
          </p>
        </div>
      </div>

      <div className="mt-5 flex min-w-0 items-center gap-5">
        <div
          className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-slate-900"
          aria-label={`AI Business Score ${score} out of 100`}
        >
          <div
            aria-hidden="true"
            className="absolute inset-1 rounded-full border border-cyan-400/10"
          />

          <div className="text-center">
            <p className="text-2xl font-black tracking-tight text-cyan-300">
              {score}
            </p>

            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
              Score
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <Gauge className="h-4 w-4 shrink-0 text-emerald-400" />

            <p className="truncate text-sm font-semibold text-white">
              {aiScore.label || "No assessment available"}
            </p>
          </div>

          {aiScore.factors?.length ? (
            <div className="mt-3 space-y-1.5">
              {aiScore.factors.slice(0, 4).map((factor) => (
                <div
                  key={factor}
                  className="flex min-w-0 items-start gap-2 text-xs text-slate-400"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400/80" />

                  <span className="min-w-0 truncate">
                    {factor}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-xs text-slate-600">
              No score factors available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}