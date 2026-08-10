"use client";

interface WorkflowLead {
  id: string;
  name: string;
  email: string;
}

interface Props {
  data: {
    callToday?: WorkflowLead[];
    followUpUrgent?: WorkflowLead[];
    highConversionLeads?: WorkflowLead[];
  };
}

interface Section {
  title: string;
  border: string;
  empty: string;
  leads: WorkflowLead[];
}

function LeadItem({ lead }: { lead: WorkflowLead }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
      <p className="truncate text-sm font-medium text-white">
        {lead.name}
      </p>

      <p className="mt-1 truncate text-xs text-slate-500">
        {lead.email}
      </p>
    </div>
  );
}

export default function SalesCopilot({ data }: Props) {
  const sections: Section[] = [
    {
      title: "Call Today",
      border: "border-red-500/30",
      empty: "No calls scheduled",
      leads: data.callToday ?? [],
    },
    {
      title: "Follow Up",
      border: "border-yellow-500/30",
      empty: "No urgent follow-ups",
      leads: data.followUpUrgent ?? [],
    },
    {
      title: "High Conversion",
      border: "border-emerald-500/30",
      empty: "No high-value opportunities",
      leads: data.highConversionLeads ?? [],
    },
  ];

  return (
    <section className="grid min-w-0 gap-4 md:grid-cols-3">
      {sections.map((section) => (
        <article
          key={section.title}
          className={`min-w-0 rounded-xl border ${section.border} bg-slate-900 p-4`}
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-300">
              {section.title}
            </h3>

            <span className="rounded-full border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] font-medium text-slate-500">
              {section.leads.length}
            </span>
          </div>

          <div className="space-y-3">
            {section.leads.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-800 px-3 py-4 text-center text-xs text-slate-500">
                {section.empty}
              </p>
            ) : (
              section.leads.map((lead) => (
                <LeadItem key={lead.id} lead={lead} />
              ))
            )}
          </div>
        </article>
      ))}
    </section>
  );
}