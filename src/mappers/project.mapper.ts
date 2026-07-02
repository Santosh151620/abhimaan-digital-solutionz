import type { Project } from "@/types/project";

/**
 * v7 PROJECT MAPPER
 * - Ensures backend → UI consistency
 * - Prevents breaking changes from API evolution
 */

export class ProjectMapper {
  static toDomain(raw: any): Project {
    return {
      id: raw.id,
      name: raw.name,
      client_id: raw.client_id,
      service_type: raw.service_type,
      status: raw.status,
      priority: raw.priority,
      project_cost: Number(raw.project_cost ?? 0),
      progress_percentage: Number(raw.progress_percentage ?? 0),
      start_date: raw.start_date,
      end_date: raw.end_date,
      notes: raw.notes ?? "",
    };
  }

  static toDomainList(rawList: any[]): Project[] {
    return rawList.map(this.toDomain);
  }
}