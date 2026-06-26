import { createClient as createSupabaseClient } from "@/lib/supabase/server";

export interface Project {
  id: string;

  created_at: string;
  updated_at: string;

  client_id: string;

  name: string;

  service_type: string;

  status: string;

  project_cost: number;

  start_date: string | null;

  end_date: string | null;

  notes: string | null;
}

export interface ProjectFilters {
  search?: string;

  status?: string;

  clientId?: string;

  page?: number;

  pageSize?: number;
}

export interface PaginatedProjects {
  projects: Project[];

  total: number;

  page: number;

  pageSize: number;

  totalPages: number;
}

const TABLE = "projects";

export async function getProjects(
  filters: ProjectFilters = {}
): Promise<PaginatedProjects> {
  const supabase = await createSupabaseClient();

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from(TABLE)
    .select("*", { count: "exact" });

  if (filters.status && filters.status !== "All") {
    query = query.eq("status", filters.status);
  }

  if (filters.clientId) {
    query = query.eq("client_id", filters.clientId);
  }

  if (filters.search?.trim()) {
    const search = filters.search.trim();

    query = query.or(
      [
        `name.ilike.%${search}%`,
        `service_type.ilike.%${search}%`,
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
    projects: (data ?? []) as Project[],

    total: count ?? 0,

    page,

    pageSize,

    totalPages: Math.ceil((count ?? 0) / pageSize),
  };
}

export async function getProjectById(
  id: string
): Promise<Project | null> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Project;
}

export async function createProject(
  project: Omit<Project, "id" | "created_at" | "updated_at">
): Promise<Project> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE)
    .insert(project)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Project;
}

export async function updateProject(
  id: string,
  updates: Partial<Omit<Project, "id" | "created_at">>
): Promise<Project> {
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

  return data as Project;
}

export async function deleteProject(
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

export async function getActiveProjectsCount(): Promise<number> {
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

export async function getProjectRevenue(): Promise<number> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from(TABLE)
    .select("project_cost");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).reduce(
    (total, project) => total + Number(project.project_cost ?? 0),
    0
  );
}