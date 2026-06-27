import { createClient as createSupabaseClient } from "@/lib/supabase/server";

import type { Lead } from "@/types/lead";

export interface DashboardData {
  leads: Lead[];
  payments: any[];
  projects: any[];
  clients: any[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createSupabaseClient();

  const [
    leadsResult,
    paymentsResult,
    projectsResult,
    clientsResult,
  ] = await Promise.all([
    supabase
      .from("leads")
      .select("*"),

    supabase
      .from("payments")
      .select("*"),

    supabase
      .from("projects")
      .select("*"),

    supabase
      .from("clients")
      .select("*"),
  ]);

  return {
    leads: leadsResult.data ?? [],
    payments: paymentsResult.data ?? [],
    projects: projectsResult.data ?? [],
    clients: clientsResult.data ?? [],
  };
}