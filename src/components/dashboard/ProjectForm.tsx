"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

import type {
  Project,
  ProjectStatus,
  ProjectPriority,
  ProjectCreateInput,
} from "@/types/project";

const supabase = createClient();

interface ProjectFormProps {
  project?: Project | null;
  onClose: () => void;
  onSuccess: () => void;
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

export default function ProjectForm({
  project,
  onClose,
  onSuccess,
}: ProjectFormProps) {
  const isEdit = !!project;

  const [form, setForm] = useState<ProjectCreateInput>(() => ({
    client_id: project?.client_id ?? "",
    name: project?.name ?? "",
    service_type: project?.service_type ?? "",
    status: project?.status ?? "planning",
    priority: project?.priority ?? "MEDIUM",
    project_cost: project?.project_cost ?? 0,
    start_date: project?.start_date ?? null,
    end_date: project?.end_date ?? null,
    notes: project?.notes ?? "",
    progress_percentage: project?.progress_percentage ?? 0,
  }));

  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof ProjectCreateInput>(
    key: K,
    value: ProjectCreateInput[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit() {
    setLoading(true);

    try {
      if (isEdit && project) {
        await supabase
          .from("projects")
          .update({
            ...form,
            updated_at: new Date().toISOString(),
          })
          .eq("id", project.id);
      } else {
        await supabase.from("projects").insert({
          ...form,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-slate-950">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isEdit ? "Edit Project" : "Create Project"}
            </h2>
            <p className="text-sm text-slate-400">
              Manage project details, timeline and configuration
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
          {/* LEFT */}
          <div className="space-y-4">
            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Project Name"
              className="w-full rounded-lg bg-slate-900 p-2 text-white"
            />

            <input
              value={form.client_id}
              onChange={(e) => updateField("client_id", e.target.value)}
              placeholder="Client ID"
              className="w-full rounded-lg bg-slate-900 p-2 text-white"
            />

            <input
              value={form.service_type}
              onChange={(e) =>
                updateField("service_type", e.target.value)
              }
              placeholder="Service Type"
              className="w-full rounded-lg bg-slate-900 p-2 text-white"
            />

            <input
              type="number"
              value={form.project_cost}
              onChange={(e) =>
                updateField("project_cost", Number(e.target.value))
              }
              className="w-full rounded-lg bg-slate-900 p-2 text-white"
            />

            <select
              value={form.status}
              onChange={(e) =>
                updateField(
                  "status",
                  e.target.value as ProjectStatus
                )
              }
              className="w-full rounded-lg bg-slate-900 p-2 text-white"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={form.priority}
              onChange={(e) =>
                updateField(
                  "priority",
                  e.target.value as ProjectPriority
                )
              }
              className="w-full rounded-lg bg-slate-900 p-2 text-white"
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <input
              type="date"
              value={form.start_date ?? ""}
              onChange={(e) =>
                updateField("start_date", e.target.value || null)
              }
              className="w-full rounded-lg bg-slate-900 p-2 text-white"
            />

            <input
              type="date"
              value={form.end_date ?? ""}
              onChange={(e) =>
                updateField("end_date", e.target.value || null)
              }
              className="w-full rounded-lg bg-slate-900 p-2 text-white"
            />

            <textarea
              value={form.notes ?? ""}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={6}
              className="w-full rounded-lg bg-slate-900 p-2 text-white"
            />

            <input
              type="range"
              min={0}
              max={100}
              value={form.progress_percentage}
              onChange={(e) =>
                updateField(
                  "progress_percentage",
                  Number(e.target.value)
                )
              }
              className="w-full"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-lg bg-cyan-600 p-2 text-white"
            >
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Project"
                : "Create Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}