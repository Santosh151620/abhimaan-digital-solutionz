import type { SupabaseClient } from "@supabase/supabase-js";

import { BaseRepository } from "@/lib/db/base-repository";
import type { Project } from "@/types/crm/Projects";

export class ProjectsRepository extends BaseRepository<Project> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "projects");
  }

  async listArchived(): Promise<Project[]> {
    const { data, error } = await this.tableRef()
      .select("*")
      .eq("organization_id", this.organizationId)
      .eq("archived", true);

    if (error) throw error;

    return (data ?? []) as Project[];
  }

  async summary() {
    const projects = await this.findAll();

    return {
      total: projects.length,

      planning: projects.filter(
        p => p.status === "Planning"
      ).length,

      active: projects.filter(
        p => p.status === "Active"
      ).length,

      onHold: projects.filter(
        p => p.status === "On Hold"
      ).length,

      completed: projects.filter(
        p => p.status === "Completed"
      ).length,

      cancelled: projects.filter(
        p => p.status === "Cancelled"
      ).length,

      totalBudget: projects.reduce(
        (sum, p) => sum + p.budget,
        0
      ),
    };
  }
}