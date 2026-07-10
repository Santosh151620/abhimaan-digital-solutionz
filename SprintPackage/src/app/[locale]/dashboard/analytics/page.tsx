import { createClient as createSupabaseClient } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const supabase = await createSupabaseClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("*");


  const totalLeads = leads?.length || 0;

  const newLeads =
    leads?.filter((l) => (l.status || "New") === "New").length || 0;

  const contacted =
    leads?.filter((l) => l.status === "Contacted").length || 0;

  const qualified =
    leads?.filter((l) => l.status === "Qualified").length || 0;

  const proposal =
    leads?.filter((l) => l.status === "Proposal Sent").length || 0;

  const won =
    leads?.filter((l) => l.status === "Won").length || 0;

  const lost =
    leads?.filter((l) => l.status === "Lost").length || 0;

  const conversionRate =
    totalLeads > 0
      ? ((won / totalLeads) * 100).toFixed(1)
      : "0";

  const serviceStats: Record<string, number> = {};

  leads?.forEach((lead) => {
    const service =
      lead.service_interest || "General";

    serviceStats[service] =
      (serviceStats[service] || 0) + 1;
  });

  const services = Object.entries(serviceStats).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <main className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Analytics Dashboard
        </h1>

        <p className="text-slate-400 mt-1">
          Business performance overview
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Metric title="Total" value={totalLeads} />
        <Metric title="New" value={newLeads} />
        <Metric title="Contacted" value={contacted} />
        <Metric title="Qualified" value={qualified} />
        <Metric title="Proposal" value={proposal} />
        <Metric title="Won" value={won} />
        <Metric title="Lost" value={lost} />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <p className="text-sm text-slate-400 mb-2">
          Conversion Rate
        </p>

        <p className="text-5xl font-bold text-emerald-400">
          {conversionRate}%
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Service Demand
        </h2>

        <div className="space-y-3">
          {services.map(([service, count]) => (
            <div
              key={service}
              className="flex items-center justify-between"
            >
              <span className="text-slate-300">
                {service}
              </span>

              <span className="text-teal-400 font-semibold">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
        {title}
      </p>

      <p className="text-3xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}