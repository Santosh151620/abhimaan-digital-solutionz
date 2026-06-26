import { createClient as createSupabaseClient } from "@/lib/supabase/server";

const TABLE = "clients";

export interface CRMClient {
  id: string;

  created_at: string;

  updated_at: string;

  status: string;

  full_name: string;

  company_name: string | null;

  email: string | null;

  phone: string | null;

  notes: string | null;

  converted_from_lead_id: string | null;
}

export interface ClientFilters {
  search?: string;

  status?: string;

  page?: number;

  pageSize?: number;
}

export interface PaginatedClients {
  clients: CRMClient[];

  total: number;

  page: number;

  pageSize: number;

  totalPages: number;
}

export async function getClients(
  filters: ClientFilters = {}
): Promise<PaginatedClients> {
  const supabase = await createSupabaseClient();

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from(TABLE)
    .select("*", {
      count: "exact",
    });

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters.search?.trim()) {
    const search = filters.search.trim();

    query = query.or(
      [
        `full_name.ilike.%${search}%`,
        `company_name.ilike.%${search}%`,
        `email.ilike.%${search}%`,
        `phone.ilike.%${search}%`,
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
    clients: (data ?? []) as CRMClient[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

export async function getClientById(
  id: string
): Promise<CRMClient | null> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as CRMClient;
}

export async function createClientRecord(
  client: Omit<
    CRMClient,
    "id" | "created_at" | "updated_at"
  >
): Promise<CRMClient> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE)
    .insert(client)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as CRMClient;
}

export async function updateClient(
  id: string,
  updates: Partial<
    Omit<CRMClient, "id" | "created_at">
  >
): Promise<CRMClient> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE)
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as CRMClient;
}

export async function deleteClient(
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

export async function getActiveClientsCount(): Promise<number> {
  const supabase = await createSupabaseClient();

  const { count, error } = await supabase
    .from(TABLE)
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("status", "active");

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function convertLeadToClient(
  leadId: string,
  client: Omit<
    CRMClient,
    "id" | "created_at" | "updated_at"
  >
): Promise<CRMClient> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      ...client,
      converted_from_lead_id: leadId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as CRMClient;
}