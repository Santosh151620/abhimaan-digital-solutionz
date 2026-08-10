import { predictiveAnalytics } from "./data";

export default function PredictiveAnalyticsPanel() {
  return (
    <section
      aria-labelledby="predictive-analytics-heading"
      className="min-w-0 overflow-hidden rounded-2xl border border-amber-500/15 bg-slate-900/70 p-5 shadow-lg shadow-black/10"
    >
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">
          Forecast Signals
        </p>

        <h3
          id="predictive-analytics-heading"
          className="mt-1 text-base font-semibold text-white"
        >
          Predictive Analytics
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Forward-looking indicators supporting business planning and
          decision-making.
        </p>
      </div>

      {predictiveAnalytics.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 px-4 py-8 text-center">
          <p className="text-sm text-slate-500">
            No predictive analytics available.
          </p>
        </div>
      ) : (
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {predictiveAnalytics.map((item) => (
            <article
              key={item.metric}
              className="min-w-0 rounded-xl border border-white/5 bg-slate-950/70 p-4 transition-colors hover:border-amber-400/20"
            >
              <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-500">
                {item.metric}
              </p>

              <p className="mt-3 truncate text-2xl font-bold tracking-tight tabular-nums text-amber-400">
                {item.value}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
