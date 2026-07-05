"use client";

import { memo } from "react";

import type { Project, ProjectStatus } from "@/modules/projects/types/project";

import ProjectStatusBadge from "./ProjectStatusBadge";
import Pagination from "@/components/dashboard/Pagination";

import { useProjectAnalytics } from "@/modules/projects/hooks/useProjectAnalytics";
import { useProjectFilters } from "@/modules/projects/hooks/useProjectFilters";

interface ProjectTableProps {
  projects: Project[];
  totalProjects: number;
  onOpenProject?: (project: Project) => void;
  onEditProject?: (project: Project) => void;
}

function ProjectTable({
  projects,
  totalProjects,
  onOpenProject,
  onEditProject,
}: ProjectTableProps) {
  const {
    search,
    statusFilter,
    handleSearch,
    handleStatusChange,
    paginatedProjects,
    currentPage,
    totalPages,
    setPage,
  } = useProjectFilters(projects);

  const stats = useProjectAnalytics(projects);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Projects</h2>

            <p className="mt-1 text-sm text-slate-400">
              Search, filter and manage client projects.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none transition focus:border-cyan-500 md:w-72"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value as ProjectStatus | "all"
                )
              }
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-white/10 bg-slate-900/70">
            <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-4 font-medium">Project</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Cost</th>
              <th className="px-5 py-4 font-medium">Progress</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProjects.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-16 text-center text-slate-400"
                >
                  No projects found.
                </td>
              </tr>
            )}

            {paginatedProjects.map((project) => (
              <tr
                key={project.id}
                className="border-b border-white/5 transition hover:bg-white/5"
              >
                <td className="px-5 py-4 font-medium text-white">
                  {project.name}
                </td>

                <td className="px-5 py-4">
                  <ProjectStatusBadge status={project.status} />
                </td>

                <td className="px-5 py-4 text-slate-300">
                  â‚¹
                  {Number(project.project_cost ?? 0).toLocaleString("en-IN")}
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {project.progress_percentage ?? 0}%
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenProject?.(project)}
                      className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
                    >
                      Open
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditProject?.(project)}
                      className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-600"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-white/10 px-5 py-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Footer Stats */}
      <div className="border-t border-white/10 px-5 py-4 text-sm text-slate-400">
        Total{" "}
        <span className="font-medium text-white">{totalProjects}</span>
        {" â€¢ "}Active{" "}
        <span className="font-medium text-white">{stats.active}</span>
        {" â€¢ "}Completed{" "}
        <span className="font-medium text-white">{stats.completed}</span>
        {" â€¢ "}Completion Rate{" "}
        <span className="font-medium text-white">
          {stats.completionRate}%
        </span>
      </div>
    </div>
  );
}

export default memo(ProjectTable);
