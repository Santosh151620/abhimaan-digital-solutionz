import { ProjectsAPI } from "@/modules/projects/api/projects.api";

import type {
  Project,
  ProjectStatus,
} from "@/modules/projects/types/project";

/**
 * Project Repository
 *
 * Single source of truth for Project data access.
 * Hooks should ONLY talk to this repository.
 */

export interface FindProjectsParams {
  status?: ProjectStatus | "all";
  search?: string;
  page?: number;
  pageSize?: number;
}

export class ProjectRepository {
  static async findAll(
    params: FindProjectsParams = {}
  ) {
    return ProjectsAPI.getProjects(params);
  }

  static async findById(id: string) {
    return ProjectsAPI.getProject(id);
  }

  static async create(
    data: Partial<Project>
  ) {
    return ProjectsAPI.createProject(data);
  }

  static async update(
    id: string,
    data: Partial<Project>
  ) {
    return ProjectsAPI.updateProject(id, data);
  }

  static async remove(id: string) {
    return ProjectsAPI.deleteProject(id);
  }
}





