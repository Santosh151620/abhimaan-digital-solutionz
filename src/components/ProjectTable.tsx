"use client";

import { memo } from "react";

import type { Project } from "@/types/project";

import ProjectStatusBadge from "./ProjectStatusBadge";
import Pagination from "./Pagination";

import { useProjectFilters } from "@/hooks/useProjectFilters";
import { useProjectAnalytics } from "@/hooks/useProjectAnalytics";

function ProjectTable({
  projects,
  totalProjects,
  onOpenProject,
  onEditProject,
}: any) {
  const {
    search,
    statusFilter,
    handleSearch,
    handleStatusChange,
    paginatedProjects,
    currentPage,
    totalPages,
    startItem,
    endItem,
    totalCount,
    setPage,
  } = useProjectFilters(projects);

  const stats = useProjectAnalytics(projects);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">

      {/* HEADER */}
      <div className="border-b border-white/10 p-6">
        <div className="flex justify-between">
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search projects..."
          />

          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <table className="min-w-full">
        <tbody>
          {paginatedProjects.map((project: Project) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>
                <ProjectStatusBadge status={project.status} />
              </td>

              <td>
                ₹{Number(project.project_cost ?? 0).toLocaleString("en-IN")}
              </td>

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

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* STATS */}
      <div>
        Total: {stats.totalCost}
        Active: {stats.active}
        Completed: {stats.completed}
        Completion Rate: {stats.completionRate}%
      </div>

    </div>
  );
}

export default memo(ProjectTable);