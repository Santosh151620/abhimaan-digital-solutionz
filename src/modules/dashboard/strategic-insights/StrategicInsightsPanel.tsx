import { strategicInsights } from "./data";

export default function StrategicInsightsPanel() {
  return (
    <section
      aria-labelledby="strategic-insights-heading"
      className="min-w-0 overflow-hidden rounded-2xl border border-indigo-500/15 bg-slate-900/70 p-5 shadow-lg shadow-black/10"
    >
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
          Executive Direction
        </p>

        <h3
          id="strategic-insights-heading"
          className="mt-1 text-base font-semibold text-white"
        >
          Strategic Insights
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Business observations designed to support strategic decisions and
          priorities.
        </p>
      </div>

      {strategicInsights.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 px-4 py-8 text-center">
          <p className="text-sm text-slate-500">
            No strategic insights available.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {strategicInsights.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-white/5 bg-slate-950/70 p-4 transition-colors hover:border-indigo-400/20"
            >
              <h4 className="text-sm font-semibold text-indigo-300">
                {item.title}
              </h4>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
