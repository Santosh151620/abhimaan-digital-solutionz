"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import type {
  Project,
  ProjectPriority,
  ProjectStatus,
} from "@/types/project";

const supabase = createClient();

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    projectId: string,
    updates: Partial<Project>
  ) => Promise<void>;
}

interface ProjectTimelineItem {
  id: string;
  project_id: string;
  message: string;
  event_type: string;
  created_at: string;
}

const STATUS_OPTIONS: ProjectStatus[] = [
  "planning",
  "active",
  "on_hold",
  "completed",
  "cancelled",
];

const PRIORITY_OPTIONS: ProjectPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

export default function ProjectModal({
  project,
  isOpen,
  onClose,
  onUpdate,
}: ProjectModalProps) {
  const [status, setStatus] =
    useState<ProjectStatus>("planning");

  const [priority, setPriority] =
    useState<ProjectPriority>("LOW");

  const [progress, setProgress] =
    useState(0);

  const [timeline, setTimeline] =
    useState<ProjectTimelineItem[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const loadTimeline = useCallback(async () => {
    if (!project) return;

    setLoading(true);

    const { data } = await supabase
      .from("project_timeline")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", {
        ascending: false,
      });

    setTimeline(
      (data as ProjectTimelineItem[]) ?? []
    );

    setLoading(false);
  }, [project]);
  useEffect(() => {
    if (!project) return;

    queueMicrotask(() => {
      setStatus(project.status);
      setPriority(project.priority);
      setProgress(project.progress_percentage ?? 0);
    });
  }, [project]);

  if (!isOpen || !project) return null;

  async function saveChanges() {
    if (!project) return;

    setSaving(true);

    const projectId = project.id;

    try {
      await onUpdate(projectId, {
        status,
        priority,
        progress_percentage: progress,
      });

      await supabase
        .from("project_timeline")
        .insert({
          project_id: projectId,
          message: `Updated project (${status}, ${priority}, ${progress}%)`,
          event_type: "update",
        });

      await loadTimeline();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="w-full max-w-5xl rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">

        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Project Details
            </h2>

            <p className="text-sm text-slate-400">
              Manage project status, priority and progress
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>

        <div className="grid gap-8 p-6 lg:grid-cols-2">

          <div className="space-y-5">

            <div>
              <p className="text-xs text-slate-500">
                Project Name
              </p>

              <p className="font-medium text-white">
                {project.name}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Service Type
              </p>

              <p className="text-slate-300">
                {project.service_type}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Client ID
              </p>

              <p className="break-all text-slate-400">
                {project.client_id}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Project Cost
              </p>

              <p className="text-white">
                ₹
                {Number(
                  project.project_cost ?? 0
                ).toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Start Date
              </p>

              <p className="text-slate-300">
                {project.start_date
                  ? project.start_date.split("T")[0]
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                End Date
              </p>

              <p className="text-slate-300">
                {project.end_date
                  ? project.end_date.split("T")[0]
                  : "-"}
              </p>
            </div>

            <div className="border-t border-white/10 pt-4">
              <p className="mb-2 text-sm text-slate-400">
                Status
              </p>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as ProjectStatus
                  )
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm text-slate-400">
                Priority
              </p>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value as ProjectPriority
                  )
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm text-slate-400">
                Progress ({progress}%)
              </p>

              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) =>
                  setProgress(Number(e.target.value))
                }
                className="w-full"
              />
            </div>

            <button
              onClick={saveChanges}
              disabled={saving}
              className="w-full rounded-lg bg-cyan-600 py-2 text-white hover:bg-cyan-700"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

          <div className="space-y-6">

            <div>

              <h3 className="mb-3 text-sm text-slate-400">
                Project Timeline
              </h3>

              {loading && (
                <p className="text-sm text-slate-500">
                  Loading timeline...
                </p>
              )}

              {!loading &&
                timeline.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No activity yet.
                  </p>
                )}

              <div className="space-y-3">
                {timeline.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg bg-slate-900 p-3 text-sm"
                  >
                    <div className="text-white">
                      {item.message}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {item.event_type}
                    </div>

                    <div className="text-xs text-slate-600">
                      {item.created_at.split("T")[0]}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900 p-4">

              <p className="text-xs uppercase tracking-wide text-slate-500">
                Quick Summary
              </p>

              <div className="mt-3 space-y-2 text-sm">

                <div className="flex justify-between text-slate-400">
                  <span>Status</span>
                  <span className="text-white">
                    {status}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Priority</span>
                  <span className="text-white">
                    {priority}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Progress</span>
                  <span className="text-white">
                    {progress}%
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className="flex justify-end border-t border-white/10 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}