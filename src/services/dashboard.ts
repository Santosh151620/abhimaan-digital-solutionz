import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import type { DashboardLead, DashboardMetrics } from "@/types/dashboard";

const TABLE = "leads";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createSupabaseClient();

  const [
    totalResult,
    newResult,
    contactedResult,
    qualifiedResult,
    proposalResult,
    wonResult,
    lostResult,
    clientsResult,
    recentResult,
  ] = await Promise.all([
    supabase.from(TABLE).select("*", { count: "exact", head: true }),

    supabase
      .from(TABLE)
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),

    supabase
      .from(TABLE)
      .select("*", { count: "exact", head: true })
      .eq("status", "contacted"),

    supabase
      .from(TABLE)
      .select("*", { count: "exact", head: true })
      .eq("status", "qualified"),

    supabase
      .from(TABLE)
      .select("*", { count: "exact", head: true })
      .eq("status", "proposal"),

    supabase
      .from(TABLE)
      .select("*", { count: "exact", head: true })
      .eq("status", "won"),

    supabase
      .from(TABLE)
      .select("*", { count: "exact", head: true })
      .eq("status", "lost"),

    supabase
      .from("clients")
      .select("*", { count: "exact", head: true }),

    supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const totalLeads = totalResult.count ?? 0;
  const wonLeads = wonResult.count ?? 0;

  const recentLeads: DashboardLead[] = (recentResult.data ?? []).map(
    (lead) => ({
      id: lead.id,
      full_name: lead.full_name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      service_interest: lead.service_interest,
      source: lead.source,
      status: lead.status,
      created_at: lead.created_at,
      client_id: lead.client_id,
    })
  );

  return {
    totalLeads,
    newLeads: newResult.count ?? 0,
    contactedLeads: contactedResult.count ?? 0,
    qualifiedLeads: qualifiedResult.count ?? 0,
    proposalLeads: proposalResult.count ?? 0,
    wonLeads,
    lostLeads: lostResult.count ?? 0,
    activeClients: clientsResult.count ?? 0,
    conversionRate:
      totalLeads > 0
        ? Number(((wonLeads / totalLeads) * 100).toFixed(1))
        : 0,
    recentLeads,
  };
}