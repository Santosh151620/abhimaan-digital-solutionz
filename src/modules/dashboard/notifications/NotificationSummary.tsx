"use client";

const items: readonly string[] = [
  "2 proposals awaiting approval",
  "5 follow-ups due today",
  "1 payment reminder pending",
  "Lead imported successfully",
];

export default function NotificationSummary() {
  return (
    <section
      aria-labelledby="notification-summary-heading"
      className="min-w-0 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 shadow-lg shadow-black/10"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
            Attention
          </p>

          <h3
            id="notification-summary-heading"
            className="mt-1 text-base font-semibold text-white"
          >
            Notifications
          </h3>
        </div>

        <span className="flex h-6 min-w-6 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 text-[10px] font-semibold text-cyan-300">
          {items.length}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 px-4 py-7 text-center">
          <p className="text-sm text-slate-400">
            No notifications.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-slate-950/70 px-4 py-3 text-sm text-slate-300 transition-colors hover:border-cyan-500/15 hover:bg-slate-950"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_7px_rgba(34,211,238,0.5)]"
              />

              <span className="min-w-0 leading-5">
                {item}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
