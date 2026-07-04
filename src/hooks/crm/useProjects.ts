"use client";

import { useQuery } from "@tanstack/react-query";

import { ProjectRepository } from "@/repositories/project.repository";

import { normalizeProjects } from "@/lib/crm/normalizeProjects";

import type { GetProjectsParams } from "@/api/projects.api";

export function useProjects(
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