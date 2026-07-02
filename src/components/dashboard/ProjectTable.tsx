"use client";

import { memo, useMemo, useState } from "react";

import type { Project, ProjectStatus } from "@/types/project";

import ProjectStatusBadge from "./ProjectStatusBadge";
import Pagination from "./Pagination";

/**
 * v5 ENTERPRISE HOOK PLACEHOLDERS
 * (Future RBAC + Multi-tenant integration layer)
 */
function useRBAC() {
  return {
    canView: true,
    canEdit: true,
    canDelete: false,
  };
}

function useTenantScope() {
  return {
    tenantId: "demo-tenant", // TODO: replace with auth context
  };
}

interface ProjectTableProps {
  projects: Project[];
  currentPage: number;
  totalPages: number;
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

/**
 * SAFE HELPERS (keeps UI clean, avoids logic loss)
 */
const formatINR = (value?: number) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN")}`;

const getDateOnly = (date?: string) =>
  date ? date.split("T")[0] : "-";

function ProjectTable({
  projects,
  totalProjects,
  onOpenProject,
  onEditProject,
}: ProjectTableProps) {
  const { canView, canEdit } = useRBAC();
  const { tenantId } = useTenantScope();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | ProjectStatus>("all");
  const [page, setPage] = useState(1);

  /**
   * FILTERING (multi-tenant ready hook point)
   */
  const filteredProjects = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return projects.filter((project) => {
      // Future: tenant isolation
      // if (project.tenant_id !== tenantId) return false;

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
  }, [projects, search, statusFilter, tenantId]);

  const totalPagesLocal = Math.max(
    1,
    Math.ceil(filteredProjects.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPagesLocal);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return filteredProjects.slice(start, start + PAGE_SIZE);
  }, [filteredProjects, currentPage]);

  /**
   * ANALYTICS ENGINE (preserved, centralized safely)
   */
  const analytics = useMemo(() => {
    const totalCost = projects.reduce(
      (sum, p) => sum + Number(p.project_cost ?? 0),
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

    const completionRate =
      projects.length === 0
        ? 0
        : Math.round((completed / projects.length) * 100);

    const avgProgress =
      projects.length === 0
        ? 0
        : Math.round(
            projects.reduce(
              (sum, p) =>
                sum + (p.progress_percentage ?? 0),
              0
            ) / projects.length
          );

    return {
      totalCost,
      active,
      completed,
      onHold,
      completionRate,
      avgProgress,
    };
  }, [projects]);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(
    value: "all" | ProjectStatus
  ) {
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
            <p className="mt-1 text-sm text-slate-400">
              Track projects, milestones, delivery progress and client work.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none transition focus:border-cyan-500 md:w-72"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value as "all" | ProjectStatus
                )
              }
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none"
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

          <thead className="border-b border-white/10 bg-slate-900/70">
            <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-4 font-medium">Project</th>
              <th className="px-5 py-4 font-medium">Service</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Priority</th>
              <th className="px-5 py-4 font-medium">Cost</th>
              <th className="px-5 py-4 font-medium">Progress</th>
              <th className="px-5 py-4 font-medium">Timeline</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProjects.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center text-slate-400">
                  No projects found.
                </td>
              </tr>
            )}

            {paginatedProjects.map((project) => (
              <tr
                key={project.id}
                className="border-b border-white/5 transition hover:bg-white/5"
              >
                <td className="px-5 py-4 align-top">
                  <div className="font-medium text-white">{project.name}</div>
                  <div className="mt-1 text-xs text-slate-400">Client ID</div>
                  <div className="text-xs text-slate-500 break-all">
                    {project.client_id}
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {project.service_type}
                </td>

                <td className="px-5 py-4">
                  <ProjectStatusBadge status={project.status} />
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold border bg-slate-500/20 text-slate-300 border-slate-500/30">
                    {project.priority}
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-300">
                  {formatINR(project.project_cost)}
                </td>

                <td className="px-5 py-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white font-medium">
                        {project.progress_percentage ?? 0}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-cyan-500 transition-all"
                        style={{
                          width: `${project.progress_percentage ?? 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm">
                  <div className="text-slate-300">
                    {getDateOnly(project.start_date)}
                  </div>
                  <div className="text-slate-500">
                    {getDateOnly(project.end_date)}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onOpenProject?.(project)}
                      className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white"
                    >
                      Open
                    </button>

                    {canEdit && (
                      <button
                        onClick={() => onEditProject?.(project)}
                        className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          {/* FOOTER */}
          <tfoot>
            <tr>
              <td colSpan={8} className="border-t border-white/10 px-5 py-4">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  <div className="text-sm text-slate-400">
                    Showing{" "}
                    <span className="font-semibold text-white">
                      {filteredProjects.length === 0
                        ? 0
                        : (currentPage - 1) * PAGE_SIZE + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-white">
                      {Math.min(
                        currentPage * PAGE_SIZE,
                        filteredProjects.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-white">
                      {filteredProjects.length}
                    </span>{" "}
                    projects
                  </div>

                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPagesLocal}
                    onPageChange={setPage}
                  />
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* SUMMARY */}
      <div className="border-t border-white/10 bg-slate-950/40 p-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
            <p className="text-xs uppercase text-slate-500">Total Projects</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {totalProjects}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
            <p className="text-xs uppercase text-slate-500">Active</p>
            <p className="mt-2 text-3xl font-bold text-sky-400">
              {analytics.active}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
            <p className="text-xs uppercase text-slate-500">Completed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {analytics.completed}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900 p-5">
            <p className="text-xs uppercase text-slate-500">On Hold</p>
            <p className="mt-2 text-3xl font-bold text-amber-400">
              {analytics.onHold}
            </p>
          </div>
        </div>
      </div>

      <div className="h-6" />
    </div>
  );
}

export default memo(ProjectTable);