"use client";

const feed: readonly string[] = [
  "Lead assigned to Sales",
  "Proposal sent to Acme Pvt Ltd",
  "Payment received from Nova Tech",
  "Follow-up scheduled for tomorrow",
  "Support ticket resolved",
];

export default function LiveActivityTicker() {
  return (
    <section
      aria-labelledby="live-activity-heading"
      className="min-w-0 overflow-hidden rounded-2xl border border-emerald-500/15 bg-slate-900/70 p-5 shadow-lg shadow-black/10"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
            Activity Stream
          </p>

          <h3
            id="live-activity-heading"
            className="mt-1 text-base font-semibold text-white"
          >
            Live Activity
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Latest operational events across the CRM workspace.
          </p>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.7)]"
          />
          Live
        </span>
      </div>

      {feed.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 px-4 py-7 text-center">
          <p className="text-sm text-slate-400">
            No recent activity.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {feed.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-950/70 px-4 py-3 transition-colors hover:border-emerald-500/15 hover:bg-slate-950"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.6)]"
              />

              <p className="min-w-0 text-sm leading-5 text-slate-300">
                {item}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
