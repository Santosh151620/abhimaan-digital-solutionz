import { customerSuccess } from "./data";

export default function CustomerSuccessPanel() {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-900/80 shadow-lg shadow-black/10">
      <div className="border-b border-white/5 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
              Customer Intelligence
            </p>

            <h3 className="mt-1 text-base font-semibold text-white">
              Customer Success
            </h3>
          </div>

          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-medium text-cyan-300">
            Live
          </span>
        </div>
      </div>

      <div className="grid min-w-0 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {customerSuccess.map((item) => (
          <article
            key={item.metric}
            className="min-w-0 rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 transition-colors hover:border-cyan-500/20"
          >
            <p className="truncate text-xs font-medium text-slate-400">
              {item.metric}
            </p>

            <p className="mt-2 truncate text-2xl font-bold tracking-tight text-cyan-400">
              {item.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}