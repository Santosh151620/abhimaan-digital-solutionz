import type { SupabaseClient } from "@supabase/supabase-js";

import { ProjectsRepository } from "@/repositories/projects.repository";

import type {
  Project,
  ProjectStatus,
} from "@/types/crm/Projects";

export class ProjectsService {
  constructor(
    private readonly repository: ProjectsRepository,
  ) {}

  async list(): Promise<Project[]> {
    return this.repository.findAll();
  }

  async listArchived(): Promise<Project[]> {
    return this.repository.listArchived();
  }

  async details(
    id: string,
  ): Promise<Project | null> {
    return this.repository.findById(id);
  }

  async create(
    data: Partial<Project>,
  ): Promise<Project> {
    return this.repository.create(data);
  }

  async update(
    id: string,
    data: Partial<Project>,
  ): Promise<Project> {
    return this.repository.update(
      id,
      data,
    );
  }

  async updateStatus(
    id: string,
    status: ProjectStatus,
  ): Promise<Project> {
    return this.repository.update(
      id,
      {
        status,
      },
    );
  }

  async delete(
    id: string,
  ): Promise<void> {
    return this.repository.delete(id);
  }

  async summary() {
    return this.repository.summary();
  }
}

export function createProjectsService(
  supabase: SupabaseClient,
) {
  return new ProjectsService(
    new ProjectsRepository(
      supabase,
    ),
  );
}