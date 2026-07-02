import { apiRequest } from "./client";
import type { Project } from "@/types/project";
import type { ProjectStatus } from "@/types/project";

/**
 * v6 PROJECT API LAYER
 * - CRUD abstraction
 * - Future backend-ready
 * - Tenant-aware
 */

export interface GetProjectsParams {
  status?: ProjectStatus | "all";
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ProjectsResponse {
  data: Project[];
  total: number;
  page: number;
  totalPages: number;
}

export const ProjectsAPI = {
  /**
   * GET PROJECTS
   */
  async getProjects(params: GetProjectsParams = {}) {
    const query = new URLSearchParams();

    if (params.status) query.append("status", params.status);
    if (params.search) query.append("search", params.search);
    if (params.page) query.append("page", String(params.page));
    if (params.pageSize)
      query.append("pageSize", String(params.pageSize));

    return apiRequest<ProjectsResponse>(
      `/projects?${query.toString()}`
    );
  },

  /**
   * GET SINGLE PROJECT
   */
  async getProject(id: string) {
    return apiRequest<Project>(`/projects/${id}`);
  },

  /**
   * CREATE PROJECT
   */
  async createProject(data: Partial<Project>) {
    return apiRequest<Project>(`/projects`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * UPDATE PROJECT
   */
  async updateProject(id: string, data: Partial<Project>) {
    return apiRequest<Project>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE PROJECT
   */
  async deleteProject(id: string) {
    return apiRequest<{ success: boolean }>(
      `/projects/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};