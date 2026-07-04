"use client";

import { memo, useMemo, useState } from "react";

import type { Project, ProjectStatus } from "@/types/project";

import ProjectStatusBadge from "./ProjectStatusBadge";

/**
 * v5 ENTERPRISE HOOK PLACEHOLDERS
 */
function useRBAC() {
  return {
    canView: true,
  };
}

interface ProjectTableProps {
  projects: Project[];
  totalProjects: number;
  onOpenProject?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
}

const STATUS_OPTIONS: Array<{
  value: "all" | ProjectStatus;
  label: string;
}> = [
  { value: "all", label: "All Status" },
  { value: "planning", label: "Planning" },
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const PAGE_SIZE = 10;

const formatINR = (value?: number) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN")}`;

function ProjectTable({
  projects,
  totalProjects,
  onOpenProject,
  onEditProject,
}: ProjectTableProps) {
  const { canView } = useRBAC();

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
        statusFilter === "all" ||
        project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const totalPagesLocal = Math.max(
    1,
    Math.ceil(filteredProjects.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPagesLocal);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredProjects.slice(start, start + PAGE_SIZE);
  }, [filteredProjects, currentPage]);

  const analytics = useMemo(() => {
    const totalCost = projects.reduce(
      (sum: number, p: Project) =>
        sum + Number(p.project_cost ?? 0),
      0
    );

    const active = projects.filter(
      (p) => p.status === "active"
    ).length;

    const completed = projects.filter(
      (p) => p.status === "completed"
    ).length;

    const onHold = projects.filter(
      (p) => p.status === "on_hold"
    ).length;

    return {
      totalCost,
      active,
      completed,
      onHold,
    };
  }, [projects]);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(value: "all" | ProjectStatus) {
    setStatusFilter(value);
    setPage(1);
  }

  if (!canView) {
    return (
      <div className="p-6 text-slate-400">
        Access denied.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">

      {/* HEADER */}
      <div className="border-b border-white/10 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Projects
            </h2>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value as "all" | ProjectStatus
                )
              }
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <tbody>
            {paginatedProjects.map((project) => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>
                  <ProjectStatusBadge status={project.status} />
                </td>

                <td>{formatINR(project.project_cost)}</td>

                <td>{project.progress_percentage ?? 0}%</td>

                <td>
                  <button onClick={() => onOpenProject?.(project)}>
                    Open
                  </button>

                  <button onClick={() => onEditProject?.(project)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SUMMARY */}
      <div>
        Total: {totalProjects}
        Active: {analytics.active}
        Completed: {analytics.completed}
        On Hold: {analytics.onHold}
      </div>
    </div>
  );
}

export default memo(ProjectTable);