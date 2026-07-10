import type { PipelineSnapshot } from "@/services/crm/pipeline";


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

const priorityStyles = {
  hot: "border-red-500/40 text-red-400",
  warm: "border-yellow-500/40 text-yellow-400",
  cold: "border-slate-600 text-slate-400",
};

function PipelineLeadCard({
  lead,
}: {
  lead: PipelineSnapshot["stages"][keyof PipelineSnapshot["stages"]][number];
}) {
  return (
    <div className="rounded-lg border border-slate-800 p-3 transition hover:border-slate-700">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-medium text-white">
          {lead.full_name}
        </p>

        <span
          className={`rounded-full border px-2 py-1 text-[10px] uppercase ${priorityStyles[lead.priority]}`}
        >
          {lead.priority}
        </span>
      </div>

      <p className="mt-1 truncate text-xs text-slate-500">
        {lead.email}
      </p>

      <p className="mt-2 text-[11px] text-slate-500">
        Score {lead.score}
      </p>
    </div>
  );
}

export default function PipelineOverview({
  data,
}: Props) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      {STAGES.map(({ key, label }) => {
        const leads = data[key] ?? [];

        return (
          <article
            key={key}
            className="rounded-xl border border-slate-800 bg-slate-900 p-4"
          >
            <header className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-300">
                {label}
              </h3>

              <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-400">
                {leads.length}
              </span>
            </header>

            <div className="space-y-3">
              {leads.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No leads
                </p>
              ) : (
                leads.map((lead) => (
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