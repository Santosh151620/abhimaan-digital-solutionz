"use client";

import { useMemo } from "react";
import type { Project, ProjectStatus } from "@/modules/projects/types/project";

interface CRMQuery {
  search: string;
  status: "all" | ProjectStatus;
}

export function useProjectsCRM(
  projects: Project[],
  query: CRMQuery
) {
  return useMemo(() => {
    const keyword = query.search.trim().toLowerCase();

    const filtered = projects.filter((p) => {
      const matchesSearch =
        keyword.length === 0 ||
        p.name.toLowerCase().includes(keyword) ||
        p.service_type.toLowerCase().includes(keyword) ||
        p.client_id.toLowerCase().includes(keyword);

      const matchesStatus =
        query.status === "all"
          ? true
          : p.status === query.status;

      return matchesSearch && matchesStatus;
    });

    return {
      filtered
    };
  }, [projects, query.search, query.status]);
}
