"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

import type {
  Project,
  ProjectStatus,
  ProjectPriority,
} from "@/types/project";

const supabase = createClient();

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (projectId: string, updates: Partial<Project>) => Promise<void>;
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
  const [status, setStatus] = useState<ProjectStatus>("planning");
  const [priority, setPriority] = useState<ProjectPriority>("LOW");

  const [progress, setProgress] = useState(0);

  const [timeline, setTimeline] = useState<ProjectTimelineItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!project) return;

    setStatus(project.status);
    setPriority(project.priority);
    setProgress(project.progress_percentage ?? 0);

    loadTimeline();
  }, [project?.id]);

  if (!isOpen || !project) return null;

  async function loadTimeline() {
    setLoading(true);

    const { data } = await supabase
      .from("project_timeline")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false });

    setTimeline((data as ProjectTimelineItem[]) || []);
    setLoading(false);
  }

  async function saveChanges() {
    if (!project) return;

    setSaving(true);

    try {
      await onUpdate(project.id, {
        status,
        priority,
        progress_percentage: progress,
      });

      await supabase.from("project_timeline").insert({
        project_id: project.id,
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
              {/* HEADER */}
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

        {/* BODY */}
        <div className="grid gap-8 p-6 lg:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="space-y-5">

            <div>
              <p className="text-xs text-slate-500">Project Name</p>
              <p className="text-white font-medium">
                {project.name}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Service Type</p>
              <p className="text-slate-300">
                {project.service_type}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Client ID</p>
              <p className="text-slate-400 break-all">
                {project.client_id}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Project Cost</p>
              <p className="text-white">
                ₹{Number(project.project_cost ?? 0).toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Start Date</p>
              <p className="text-slate-300">
                {project.start_date ? project.start_date.split("T")[0] : "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">End Date</p>
              <p className="text-slate-300">
                {project.end_date ? project.end_date.split("T")[0] : "-"}
              </p>
            </div>

            {/* STATUS */}
            <div className="pt-4 border-t border-white/10">

              <p className="text-sm text-slate-400 mb-2">
                Status
              </p>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as ProjectStatus)
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

            {/* PRIORITY */}
            <div>

              <p className="text-sm text-slate-400 mb-2">
                Priority
              </p>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as ProjectPriority)
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

            {/* PROGRESS */}
            <div>

              <p className="text-sm text-slate-400 mb-2">
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
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>
                    {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* TIMELINE */}
            <div>
              <h3 className="text-sm text-slate-400 mb-3">
                Project Timeline
              </h3>

              {loading && (
                <p className="text-slate-500 text-sm">
                  Loading timeline...
                </p>
              )}

              {!loading && timeline.length === 0 && (
                <p className="text-slate-500 text-sm">
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

                    <div className="text-xs text-slate-500 mt-1">
                      {item.event_type}
                    </div>

                    <div className="text-xs text-slate-600">
                      {item.created_at.split("T")[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUMMARY BOX */}
            <div className="rounded-xl border border-white/10 bg-slate-900 p-4">

              <p className="text-xs uppercase tracking-wide text-slate-500">
                Quick Summary
              </p>

              <div className="mt-3 space-y-2 text-sm">

                <div className="flex justify-between text-slate-400">
                  <span>Status</span>
                  <span className="text-white">{status}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Priority</span>
                  <span className="text-white">{priority}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Progress</span>
                  <span className="text-white">{progress}%</span>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-white/10 px-6 py-4 flex justify-end">
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