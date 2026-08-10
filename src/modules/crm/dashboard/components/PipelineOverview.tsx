import type { PipelineSnapshot } from "../services/pipeline";

interface Props {
  data: PipelineSnapshot["stages"];
}

const STAGES = [
  { key: "new", label: "New Leads" },
  { key: "contacted", label: "Contacted" },
  { key: "qualified", label: "Qualified" },
  { key: "proposal", label: "Proposal" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
] as const;

type PipelineLead =
  PipelineSnapshot["stages"][keyof PipelineSnapshot["stages"]][number];

const priorityStyles: Record<
  PipelineLead["priority"],
  string
> = {
  hot: "border-red-400/30 bg-red-500/10 text-red-300",
  warm: "border-amber-400/30 bg-amber-500/10 text-amber-300",
  cold: "border-slate-700 bg-slate-800/40 text-slate-400",
};

function PipelineLeadCard({
  lead,
}: {
  lead: PipelineLead;
}) {
  return (
    <div className="group rounded-xl border border-white/5 bg-slate-950/70 p-3 transition hover:border-cyan-400/20 hover:bg-slate-950">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 truncate text-sm font-semibold text-white">
          {lead.full_name}
        </p>

        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${priorityStyles[lead.priority]}`}
        >
          {lead.priority}
        </span>
      </div>

      <p className="mt-1 truncate text-xs text-slate-500">
        {lead.email}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wide text-slate-600">
          Lead Score
        </span>

        <span className="text-xs font-semibold text-cyan-300">
          {lead.score}
        </span>
      </div>
    </div>
  );
}

export default function PipelineOverview({
  data,
}: Props) {
  return (
    <section className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-6">
      {STAGES.map(({ key, label }) => {
        const leads = data[key] ?? [];

        return (
          <article
            key={key}
            className="min-w-0 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 shadow-lg shadow-black/10"
          >
            <header className="mb-4 flex items-center justify-between gap-2">
              <h3 className="truncate text-xs font-semibold uppercase tracking-wide text-slate-300">
                {label}
              </h3>

              <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/[0.04] px-2 text-[10px] font-semibold text-slate-400">
                {leads.length}
              </span>
            </header>

            <div className="space-y-2.5">
              {leads.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-800 px-3 py-5 text-center">
                  <p className="text-[11px] text-slate-600">
                    No leads
                  </p>
                </div>
              ) : (
                leads.map((lead: PipelineLead) => (
                  <PipelineLeadCard
                    key={lead.id}
                    lead={lead}
                  />
                ))
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}
