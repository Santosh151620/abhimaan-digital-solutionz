import { createClient as createSupabaseClient } from "@/lib/supabase/server";

import type { Lead } from "@/types/lead";
import type { Client } from "@/modules/clients/types/client";
import type { Payment } from "@/types/payment";
import type { Project } from "@/modules/projects/types/project";

export interface DashboardData {
  leads: Lead[];
  clients: Client[];
  projects: Project[];
  payments: Payment[];
}

async function fetchTable<T>(
  table: string
): Promise<T[]> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from(table)
    .select("*");

  if (error) {
    console.error(
      `[DashboardData] ${table}:`,
      error.message
    );
    return [];
  }

  return (data ?? []) as T[];
}

/**
 * Dashboard Aggregator
 *
 * Single entry point used by the CRM dashboard.
 * All modules are loaded in parallel and failures
 * are isolated to their own dataset.
 */
export async function getDashboardData(): Promise<DashboardData> {
  const [
    leads,
    clients,
    projects,
    payments,
  ] = await Promise.all([
    fetchTable<Lead>("leads"),
    fetchTable<Client>("clients"),
    fetchTable<Project>("projects"),
    fetchTable<Payment>("payments"),
  ]);

  return {
    leads,
    clients,
    projects,
    payments,
  };
}
