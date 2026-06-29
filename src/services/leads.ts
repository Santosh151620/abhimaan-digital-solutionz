import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { requireEmployee } from "@/lib/auth";
import type { DashboardLead, LeadStatus } from "@/types/dashboard";

// await requireEmployee();

const TABLE = "leads";

export interface LeadFilters {
  search?: string;
  status?: LeadStatus | "all";
  source?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedLeads {
  leads: DashboardLead[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
// await requireEmployee();
export async function getLeads(
  filters: LeadFilters = {}
): Promise<PaginatedLeads> {
  const supabase = await createSupabaseClient();

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from(TABLE)
    .select("*", { count: "exact" });

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.source) {
    query = query.eq("source", filters.source);
  }

  if (filters.search?.trim()) {
    const search = filters.search.trim();

    query = query.or(
      [
        `full_name.ilike.%${search}%`,
        `email.ilike.%${search}%`,
        `company.ilike.%${search}%`,
        `phone.ilike.%${search}%`,
        `service_interest.ilike.%${search}%`,
      ].join(",")
    );
  }

  const { data, count, error } = await query
    .order("created_at", {
      ascending: false,
    })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    leads: (data ?? []) as DashboardLead[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}
// await requireEmployee();
export async function getLeadById(
  id: string
): Promise<DashboardLead | null> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as DashboardLead;
}
// await requireEmployee();
export async function getRecentLeads(
  limit = 10
): Promise<DashboardLead[]> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as DashboardLead[];
}
// await requireEmployee();
export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<DashboardLead> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE)
    .update({
      status,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as DashboardLead;
}

// await requireEmployee();
export async function convertLeadToClient(
  leadId: string,
  clientId: string
): Promise<DashboardLead> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE)
    .update({
      client_id: clientId,
      status: "won",
    })
    .eq("id", leadId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as DashboardLead;
}
// await requireEmployee();
export async function deleteLead(
  id: string
): Promise<boolean> {
  const supabase = await createSupabaseClient();

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
// await requireEmployee();
export async function getLeadCounts() {
  const supabase = await createSupabaseClient();

  const statuses: LeadStatus[] = [
    "new",
    "contacted",
    "qualified",
    "proposal",
    "won",
    "lost",
  ];

  const result: Record<LeadStatus, number> = {
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal: 0,
    won: 0,
    lost: 0,
  };

  await Promise.all(
    statuses.map(async (status) => {
      const { count, error } = await supabase
        .from(TABLE)
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("status", status);

      if (error) {
        throw new Error(error.message);
      }

      result[status] = count ?? 0;
    })
  );

  return result;
}