import type { Project } from "@/modules/projects/types/project";

/**
 * Project Mapper
 *
 * Maps raw backend/API objects into the application's
 * canonical Project domain model.
 */

type RawProject = Record<string, unknown>;

export class ProjectMapper {
  static toDomain(raw: RawProject): Project {
    return {
      // -----------------------------------------------------------------
      // BaseEntity
      // -----------------------------------------------------------------

      id: String(raw.id ?? ""),

      entityType: "project",

      organizationId: String(
        raw.organizationId ??
          raw.organization_id ??
          ""
      ),

      createdAt: String(
        raw.createdAt ??
          raw.created_at ??
          ""
      ),

      updatedAt: String(
        raw.updatedAt ??
          raw.updated_at ??
          ""
      ),

      // -----------------------------------------------------------------
      // Project
      // -----------------------------------------------------------------

      client_id: String(raw.client_id ?? ""),

      name: String(raw.name ?? ""),

      description: String(raw.description ?? ""),

      service_type: String(raw.service_type ?? ""),

      status: (raw.status as Project["status"]) ?? "planning",

      priority:
        (raw.priority as Project["priority"]) ?? "MEDIUM",

      project_cost: Number(raw.project_cost ?? 0),

      progress_percentage: Number(
        raw.progress_percentage ?? 0
      ),

      start_date:
        (raw.start_date as string | null) ?? null,

      end_date:
        (raw.end_date as string | null) ?? null,

      notes:
        (raw.notes as string | null) ?? null,

      milestones:
        (raw.milestones as Project["milestones"]) ?? [],
    };
  }

  static toDomainList(rawList: RawProject[]): Project[] {
    return rawList.map((item) => this.toDomain(item));
  }
}
