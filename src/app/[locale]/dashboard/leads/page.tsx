import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];

export default async function LeadsPage() {
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen pt-12 px-8 max-w-7xl mx-auto bg-[#030712]">

      {/* Header Section */}
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
            Leads Management <span className="text-teal-400 font-medium">Console</span>
          </h1>
          <p className="text-sm text-slate-400">
            Monitor, track, and advance client acquisition pipelines.
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide text-slate-400">
          TOTAL RECORDS: <span className="text-teal-400 font-bold ml-1">{leads?.length || 0}</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {leads?.map((lead) => (
          // <div
          // key={lead.id}
          //className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-xl shadow-black/30 hover:border-slate-700/80 transition-all duration-200"
          //>
          <div
            key={lead.id}
            className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-xl shadow-black/30 hover:border-teal-500/40 hover:shadow-teal-950/30 transition-all duration-200"
          >

            <div>
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-wide">
                    {lead.full_name || "Anonymous Lead"}
                  </h3>

                  <div className="mt-2 text-[11px] text-slate-500 uppercase tracking-wider">
                    Lead ID: {lead.id}
                  </div>
                </div>

                {/* Status Pill Badge */}
                <span className={`text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border ${lead.status === "Won" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                  lead.status === "Lost" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                    lead.status === "Proposal Sent" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                      "bg-sky-500/10 text-sky-400 border-sky-500/20"
                  }`}>
                  {lead.status || "New"}
                </span>
              </div>

              {/* Information Rows */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Company</span>
                  <span className="text-slate-300 font-medium">{lead.company || "Independent Enterprise"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Email</span>
                  <span className="text-slate-300 font-mono">{lead.email}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Phone</span>
                  <span className="text-slate-300">{lead.phone || "—"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Service</span>
                  <span className="text-teal-400 font-medium">{lead.service_interest}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    Created
                  </span>
                  <span className="text-slate-300">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                </div>
                {/* Client Message Block */}
                {lead.message && (
                  <div className="mt-4 pt-4 border-t border-slate-800/40">
                    <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase block mb-1">
                      Client Brief
                    </span>
                    <p className="text-slate-400 text-xs leading-relaxed italic">
                      "{lead.message}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar at Bottom */}
            <div className="mt-6 pt-4 border-t border-slate-800/40 flex items-center justify-between gap-4">
              <form
                action="/api/leads/update-status"
                method="POST"
                className="flex items-center justify-between gap-4 w-full"
              >
                <input type="hidden" name="id" value={lead.id} />

                <div className="flex items-center gap-3 flex-1">
                  <label className="text-[10px] text-slate-500 font-bold tracking-wider uppercase whitespace-nowrap">
                    Stage
                  </label>
                  <select
                    name="status"
                    defaultValue={lead.status || "New"}
                    className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs cursor-pointer outline-none focus:border-teal-500/50 transition-colors w-full max-w-[160px]"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status} className="bg-slate-950 text-white p-2">
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-500 active:scale-[0.98] text-white text-xs px-5 py-2 rounded-xl transition-all font-semibold tracking-wide shadow-md shadow-teal-950/50 cursor-pointer"
                >
                  Apply Change
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
