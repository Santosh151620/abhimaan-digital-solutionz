"use client";

import { memo, useMemo, useState } from "react";

import type {
  Project,
  ProjectStatus,
} from "@/types/project";

import ProjectStatusBadge from "./ProjectStatusBadge";
import Pagination from "./Pagination";

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
    {
      value: "all",
      label: "All Status",
    },
    {
      value: "planning",
      label: "Planning",
    },
    {
      value: "active",
      label: "Active",
    },
    {
      value: "on_hold",
      label: "On Hold",
    },
    {
      value: "completed",
      label: "Completed",
    },
    {
      value: "cancelled",
      label: "Cancelled",
    },
  ];

const PAGE_SIZE = 10;

function ProjectTable({
  projects,
  totalProjects,
  onOpenProject,
  onEditProject,
}: ProjectTableProps) {

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<"all" | ProjectStatus>("all");

  const [page, setPage] = useState(1);

  const filteredProjects = useMemo(() => {

    const keyword = search.trim().toLowerCase();

    return projects.filter((project) => {

      const matchesSearch =
        keyword.length === 0 ||

        project.name
          .toLowerCase()
          .includes(keyword) ||

        project.service_type
          .toLowerCase()
          .includes(keyword) ||

        project.notes
          ?.toLowerCase()
          .includes(keyword) ||

        project.client_id
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =
        statusFilter === "all"
          ? true
          : project.status === statusFilter;

      return matchesSearch && matchesStatus;

    });

  }, [projects, search, statusFilter]);

  const totalPagesLocal = Math.max(
    1,
    Math.ceil(
      filteredProjects.length / PAGE_SIZE
    )
  );

  const currentPage = Math.min(
    page,
    totalPagesLocal
  );

  const paginatedProjects = useMemo(() => {

    const start =
      (currentPage - 1) * PAGE_SIZE;

    return filteredProjects.slice(
      start,
      start + PAGE_SIZE
    );

  }, [
    filteredProjects,
    currentPage,
  ]);

  function handleSearch(
    value: string
  ) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(
    value: "all" | ProjectStatus
  ) {
    setStatusFilter(value);
    setPage(1);
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
              Track projects,
              milestones,
              delivery progress
              and client work.
            </p>

          </div>

          <div className="flex flex-col gap-3 md:flex-row">

            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) =>
                handleSearch(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none transition focus:border-cyan-500 md:w-72"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value as
                  | "all"
                  | ProjectStatus
                )
              }
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-white outline-none"
            >
              {STATUS_OPTIONS.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>

          </div>

        </div>

      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="border-b border-white/10 bg-slate-900/70">

            <tr className="text-left text-xs uppercase tracking-wider text-slate-400">

              <th className="px-5 py-4 font-medium">
                Project
              </th>

              <th className="px-5 py-4 font-medium">
                Service
              </th>

              <th className="px-5 py-4 font-medium">
                Status
              </th>

              <th className="px-5 py-4 font-medium">
                Priority
              </th>

              <th className="px-5 py-4 font-medium">
                Cost
              </th>

              <th className="px-5 py-4 font-medium">
                Progress
              </th>

              <th className="px-5 py-4 font-medium">
                Timeline
              </th>

              <th className="px-5 py-4 text-right font-medium">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>
            {filteredProjects.length === 0 && (
              <tr>
                <td
                  colSpan={8}
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

                {/* PROJECT */}

                <td className="px-5 py-4 align-top">

                  <div className="font-medium text-white">
                    {project.name}
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    Client ID
                  </div>

                  <div className="text-xs text-slate-500 break-all">
                    {project.client_id}
                  </div>

                </td>

                {/* SERVICE */}

                <td className="px-5 py-4 text-slate-300">

                  {project.service_type}

                </td>

                {/* STATUS */}

                <td className="px-5 py-4">

                  <ProjectStatusBadge
                    status={project.status}
                  />

                </td>

                {/* PRIORITY */}

                <td className="px-5 py-4">

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold border ${project.priority === "CRITICAL"
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                      : project.priority === "HIGH"
                        ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
                        : project.priority === "MEDIUM"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-slate-500/20 text-slate-300 border-slate-500/30"
                      }`}
                  >
                    {project.priority}
                  </span>

                </td>

                {/* COST */}

                <td className="px-5 py-4 text-slate-300">

                  ₹
                  {Number(
                    project.project_cost ?? 0
                  ).toLocaleString("en-IN")}

                </td>

                {/* PROGRESS */}

                <td className="px-5 py-4">

                  <div className="flex flex-col gap-2">

                    <div className="flex justify-between text-xs">

                      <span className="text-slate-400">
                        Progress
                      </span>

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

                {/* TIMELINE */}

                <td className="px-5 py-4">

                  <div className="space-y-1 text-sm">

                    <div className="text-slate-300">

                      {project.start_date
                        ? project.start_date.split("T")[0]
                        : "-"}

                    </div>

                    <div className="text-slate-500">

                      {project.end_date
                        ? project.end_date.split("T")[0]
                        : "-"}

                    </div>

                  </div>

                </td>

                {/* ACTIONS */}

                <td className="px-5 py-4">

                  <div className="flex justify-end gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        onOpenProject?.(project)
                      }
                      className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
                    >
                      Open
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onEditProject?.(project)
                      }
                      className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
                    >
                      Edit
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

          <tfoot>
            <tr>

              <td
                colSpan={8}
                className="border-t border-white/10 px-5 py-4"
              >

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  <div className="text-sm text-slate-400">

                    Showing{" "}

                    <span className="font-semibold text-white">
                      {filteredProjects.length === 0
                        ? 0
                        : (currentPage - 1) * PAGE_SIZE + 1}
                    </span>

                    {" "}to{" "}

                    <span className="font-semibold text-white">
                      {Math.min(
                        currentPage * PAGE_SIZE,
                        filteredProjects.length
                      )}
                    </span>

                    {" "}of{" "}

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

          {/* TOTAL */}

          <div className="rounded-xl border border-white/10 bg-slate-900 p-5">

            <p className="text-xs uppercase tracking-wide text-slate-500">
              Total Projects
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {totalProjects}
            </p>

          </div>

          {/* ACTIVE */}

          <div className="rounded-xl border border-white/10 bg-slate-900 p-5">

            <p className="text-xs uppercase tracking-wide text-slate-500">
              Active Projects
            </p>

            <p className="mt-2 text-3xl font-bold text-sky-400">
              {
                projects.filter(
                  (project) =>
                    project.status === "active"
                ).length
              }
            </p>

          </div>

          {/* COMPLETED */}

          <div className="rounded-xl border border-white/10 bg-slate-900 p-5">

            <p className="text-xs uppercase tracking-wide text-slate-500">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {
                projects.filter(
                  (project) =>
                    project.status === "completed"
                ).length
              }
            </p>

          </div>

          {/* ON HOLD */}

          <div className="rounded-xl border border-white/10 bg-slate-900 p-5">

            <p className="text-xs uppercase tracking-wide text-slate-500">
              On Hold
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-400">
              {
                projects.filter(
                  (project) =>
                    project.status === "on_hold"
                ).length
              }
            </p>

          </div>

        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">

          {/* PROJECT VALUE */}

          <div className="rounded-xl border border-white/10 bg-slate-900 p-5">

            <p className="text-xs uppercase tracking-wide text-slate-500">
              Total Project Value
            </p>

            <p className="mt-3 text-3xl font-bold text-cyan-400">

              ₹

              {projects
                .reduce(
                  (total, project) =>
                    total +
                    Number(project.project_cost ?? 0),
                  0
                )
                .toLocaleString("en-IN")}

            </p>

          </div>

          {/* AVG PROGRESS */}

          <div className="rounded-xl border border-white/10 bg-slate-900 p-5">

            <p className="text-xs uppercase tracking-wide text-slate-500">
              Average Progress
            </p>

            <p className="mt-3 text-3xl font-bold text-white">

              {projects.length === 0
                ? 0
                : Math.round(
                  projects.reduce(
                    (total, project) =>
                      total +
                      (project.progress_percentage ??
                        0),
                    0
                  ) / projects.length
                )}

              %

            </p>

          </div>

        </div>

      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">

        {/* COST DISTRIBUTION */}

        <div className="rounded-xl border border-white/10 bg-slate-900 p-5">

          <p className="text-xs uppercase tracking-wide text-slate-500">
            Revenue Insight
          </p>

          <div className="mt-4 space-y-3 text-sm">

            <div className="flex justify-between text-slate-400">

              <span>High Value Projects</span>

              <span className="text-white font-medium">
                {
                  projects.filter(
                    (p) => p.project_cost >= 100000
                  ).length
                }
              </span>

            </div>

            <div className="flex justify-between text-slate-400">

              <span>Mid Value Projects</span>

              <span className="text-white font-medium">
                {
                  projects.filter(
                    (p) =>
                      p.project_cost >= 25000 &&
                      p.project_cost < 100000
                  ).length
                }
              </span>

            </div>

            <div className="flex justify-between text-slate-400">

              <span>Low Value Projects</span>

              <span className="text-white font-medium">
                {
                  projects.filter(
                    (p) => p.project_cost < 25000
                  ).length
                }
              </span>

            </div>

          </div>

        </div>

        {/* TIMELINE HEALTH */}

        <div className="rounded-xl border border-white/10 bg-slate-900 p-5">

          <p className="text-xs uppercase tracking-wide text-slate-500">
            Timeline Health
          </p>

          <div className="mt-4 space-y-3 text-sm">

            <div className="flex justify-between text-slate-400">

              <span>Started Projects</span>

              <span className="text-white font-medium">
                {
                  projects.filter(
                    (p) => p.start_date
                  ).length
                }
              </span>

            </div>

            <div className="flex justify-between text-slate-400">

              <span>Completed Timeline</span>

              <span className="text-white font-medium">
                {
                  projects.filter(
                    (p) =>
                      p.end_date &&
                      p.status === "completed"
                  ).length
                }
              </span>

            </div>

            <div className="flex justify-between text-slate-400">

              <span>Ongoing</span>

              <span className="text-white font-medium">
                {
                  projects.filter(
                    (p) =>
                      p.status === "active"
                  ).length
                }
              </span>

            </div>

          </div>

        </div>

        {/* PERFORMANCE SNAPSHOT */}

        <div className="rounded-xl border border-white/10 bg-slate-900 p-5">

          <p className="text-xs uppercase tracking-wide text-slate-500">
            Performance Snapshot
          </p>

          <div className="mt-4 space-y-3 text-sm">

            <div className="flex justify-between text-slate-400">

              <span>Avg Project Cost</span>

              <span className="text-white font-medium">
                ₹
                {projects.length === 0
                  ? 0
                  : Math.round(
                    projects.reduce(
                      (sum, p) =>
                        sum +
                        Number(p.project_cost ?? 0),
                      0
                    ) / projects.length
                  ).toLocaleString("en-IN")}
              </span>

            </div>

            <div className="flex justify-between text-slate-400">

              <span>Avg Progress</span>

              <span className="text-white font-medium">
                {projects.length === 0
                  ? 0
                  : Math.round(
                    projects.reduce(
                      (sum, p) =>
                        sum +
                        (p.progress_percentage ?? 0),
                      0
                    ) / projects.length
                  )}%
              </span>

            </div>

            <div className="flex justify-between text-slate-400">

              <span>Completion Rate</span>

              <span className="text-white font-medium">
                {projects.length === 0
                  ? 0
                  : Math.round(
                    (projects.filter(
                      (p) =>
                        p.status === "completed"
                    ).length /
                      projects.length) *
                    100
                  )}%
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* FOOTER SPACING / SAFE AREA */}
      <div className="h-6" />
    </div>
  );

  
}

      export default memo(ProjectTable);