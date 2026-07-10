"use client";

import { useQuery } from "@tanstack/react-query";

import { ProjectRepository } from "@/modules/projects/repositories/project.repository";
import { normalizeProjects } from "@/modules/projects/services/normalizeProjects";

import type { GetProjectsParams } from "@/modules/projects/api/projects.api";

export function useProjectsApi(
  params: GetProjectsParams = {}
) {
  return useQuery({
    queryKey: ["crm-projects", params],

    queryFn: async () => {
      const response =
        await ProjectRepository.findAll(params);

      return {
        ...response,
        data: normalizeProjects(response.data),
      };
    },

    staleTime: 60_000,

    gcTime: 300_000,
  });
}
