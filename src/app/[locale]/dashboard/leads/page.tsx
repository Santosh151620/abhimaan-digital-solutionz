import { supabase } from "@/lib/supabaseClient";
import LeadsDashboard from "@/components/dashboard/LeadsDashboard";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase leads fetch error:", error);
  }

  return (
    <main className="min-h-screen pt-12 px-8 max-w-7xl mx-auto bg-[#030712]">
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Leads Management{" "}
            <span className="text-teal-400 font-medium">Console</span>
          </h1>

          <p className="text-sm text-slate-400">
            Monitor, track, and advance client acquisition pipelines.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide text-slate-400">
          TOTAL RECORDS:{" "}
          <span className="text-teal-400 font-bold ml-1">
            {leads?.length || 0}
          </span>
        </div>
      </div>

      <LeadsDashboard leads={leads || []} />
    </main>
  );
}