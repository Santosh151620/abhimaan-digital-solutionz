import type { Project, ProjectStatus } from "@/types/project";

/**
 * v5 ENTERPRISE CRM SERVICE LAYER
 * - Multi-tenant ready
 * - API/DB agnostic
 * - Will later connect to backend (Supabase / Prisma / REST)
 */

export interface ProjectQueryParams {
  tenantId?: string;
  status?: ProjectStatus | "all";
  search?: string;
}

export class ProjectService {
  /**
   * FILTER PROJECTS (CORE CRM LOGIC)
   */
  static filterProjects(
    projects: Project[],
    params: ProjectQueryParams
  ): Project[] {
    const keyword = params.search?.toLowerCase().trim() ?? "";

    return projects.filter((project) => {
      // MULTI-TENANT HOOK (future DB enforcement)
      if (params.tenantId && (project as any).tenant_id) {
        if ((project as any).tenant_id !== params.tenantId) {
          return false;
        }
      }

      const matchesSearch =
        keyword.length === 0 ||
        project.name.toLowerCase().includes(keyword) ||
        project.service_type.toLowerCase().includes(keyword) ||
        project.notes?.toLowerCase().includes(keyword) ||
        project.client_id.toLowerCase().includes(keyword);

      const matchesStatus =
        !params.status ||
        params.status === "all" ||
        project.status === params.status;

      return matchesSearch && matchesStatus;
    });
  }

  /**
   * PAGINATION LOGIC (CENTRALIZED)
   */
  static paginate<T>(
    items: T[],
    page: number,
    pageSize: number
  ) {
    const start = (page - 1) * pageSize;

    return {
      data: items.slice(start, start + pageSize),
      total: items.length,
      page,
      totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
    };
  }
}