import { BackendAdapter } from "@/backend/adapter";
import type { Project } from "@/types/project";

/**
 * v7 PROJECT REPOSITORY
 * - Decouples CRM from API implementation
 * - Clean domain access layer
 */

export class ProjectRepository {
  /**
   * FETCH ALL PROJECTS
   */
  static async findAll(params?: {
    status?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    const query = new URLSearchParams();

    if (params?.status) query.append("status", params.status);
    if (params?.search) query.append("search", params.search);
    if (params?.page) query.append("page", String(params.page));
    if (params?.pageSize)
      query.append("pageSize", String(params.pageSize));

    return BackendAdapter.get<{
      data: Project[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/projects?${query.toString()}`);
  }

  /**
   * FIND ONE PROJECT
   */
  static async findById(id: string) {
    return BackendAdapter.get<Project>(`/projects/${id}`);
  }

  /**
   * CREATE PROJECT
   */
  static async create(data: Partial<Project>) {
    return BackendAdapter.post<Project>(`/projects`, data);
  }

  /**
   * UPDATE PROJECT
   */
  static async update(id: string, data: Partial<Project>) {
    return BackendAdapter.put<Project>(`/projects/${id}`, data);
  }

  /**
   * DELETE PROJECT
   */
  static async remove(id: string) {
    return BackendAdapter.delete<{ success: boolean }>(
      `/projects/${id}`
    );
  }
}