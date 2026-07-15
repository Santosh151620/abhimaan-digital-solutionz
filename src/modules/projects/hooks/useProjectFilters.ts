"use client";

import { useMemo, useState } from "react";
import type { Project, ProjectStatus } from "@/modules/projects/types/project";

const PAGE_SIZE = 10;

export function useProjectFilters(projects: Project[]) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | ProjectStatus>("all");
  const [page, setPage] = useState(1);

  const filteredProjects = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        keyword.length === 0 ||
        project.name.toLowerCase().includes(keyword) ||
        project.service_type.toLowerCase().includes(keyword) ||
        project.notes?.toLowerCase().includes(keyword) ||
        project.client_id.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProjects.slice(start, start + PAGE_SIZE);
  }, [filteredProjects, currentPage]);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(value: "all" | ProjectStatus) {
    setStatusFilter(value);
    setPage(1);
  }

  return {
    search,
    statusFilter,
    page,
    setPage,
    handleSearch,
    handleStatusChange,
    filteredProjects,
    paginatedProjects,
    currentPage,
    totalPages,
    startItem:
      filteredProjects.length === 0
        ? 0
        : (currentPage - 1) * PAGE_SIZE + 1,
    endItem: Math.min(currentPage * PAGE_SIZE, filteredProjects.length),
    totalCount: filteredProjects.length,
  };
}





