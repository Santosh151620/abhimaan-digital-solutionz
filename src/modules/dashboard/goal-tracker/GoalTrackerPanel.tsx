import { goals } from "./data";

function clampProgress(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

export default function GoalTrackerPanel() {
  return (
    <section
      aria-labelledby="goal-tracker-heading"
      className="min-w-0 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 shadow-lg shadow-black/10"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
            Execution
          </p>

          <h3
            id="goal-tracker-heading"
            className="mt-1 text-base font-semibold text-white"
          >
            Goal Tracker
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Progress against current business goals.
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-white/5 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
          Progress
        </span>
      </div>

      {goals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-5 text-sm text-slate-500">
          No goals configured.
        </div>
      ) : (
        <div className="space-y-5">
          {goals.map((goal) => {
            const progress = clampProgress(Number(goal.progress));

            return (
              <div key={goal.goal} className="min-w-0">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="min-w-0 truncate text-sm font-medium text-slate-200">
                    {goal.goal}
                  </span>

                  <span className="shrink-0 text-sm font-semibold tabular-nums text-emerald-400">
                    {progress}%
                  </span>
                </div>

                <div
                  className="h-2 overflow-hidden rounded-full bg-slate-800"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${goal.goal} progress`}
                >
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
