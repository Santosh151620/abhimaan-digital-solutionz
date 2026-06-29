import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
export const dynamic = "force-dynamic";

async function getClients() {
  const { data } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Clients</h1>
        <p className="text-gray-400">
          Total Clients: {clients.length}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
        <table className="w-full">
          <thead className="border-b border-slate-800">
            <tr>
              <th className="p-3 text-left">Client</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client: any) => (
              <tr
                key={client.id}
                className="border-b border-slate-800"
              >
                <td className="p-3">{client.full_name}</td>
                <td className="p-3">{client.company_name}</td>
                <td className="p-3">{client.email}</td>
                <td className="p-3">{client.phone}</td>
                <td className="p-3">
                  <span className="rounded border px-2 py-1 text-xs">
                    {client.status}
                  </span>
                </td>
              </tr>
            ))}

            {clients.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-slate-400"
                >
                  No clients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}