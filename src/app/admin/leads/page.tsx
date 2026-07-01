import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

const supabase = createClient();

type LeadRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
};

async function getLeads(): Promise<LeadRow[]> {
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as LeadRow[];
}

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Leads Management
        </h1>

        <p className="text-gray-600">
          Total Leads: {leads.length}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b"
              >
                <td className="p-3">{lead.full_name}</td>
                <td className="p-3">{lead.email}</td>
                <td className="p-3">{lead.phone}</td>
                <td className="p-3">{lead.company}</td>
                <td className="p-3">
                  <span className="rounded border px-2 py-1 text-xs">
                    {lead.status}
                  </span>
                </td>
              </tr>
            ))}

            {leads.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-gray-500"
                >
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}