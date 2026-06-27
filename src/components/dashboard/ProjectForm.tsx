"use client";

import { useEffect, useState } from "react";
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

  const [form, setForm] = useState<ProjectCreateInput>({
    client_id: "",
    name: "",
    service_type: "",
    status: "planning",
    priority: "MEDIUM",
    project_cost: 0,
    start_date: null,
    end_date: null,
    notes: "",
    progress_percentage: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setForm({
        client_id: project.client_id,
        name: project.name,
        service_type: project.service_type,
        status: project.status,
        priority: project.priority,
        project_cost: project.project_cost,
        start_date: project.start_date,
        end_date: project.end_date,
        notes: project.notes,
        progress_percentage: project.progress_percentage,
      });
    }
  }, [project]);

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
      
      </div>
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

          {/* LEFT SIDE */}
          <div className="space-y-4">

            {/* NAME */}
            <div>
              <label className="text-xs text-slate-500">Project Name</label>
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full mt-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
                placeholder="Enter project name"
              />
            </div>

            {/* CLIENT ID */}
            <div>
              <label className="text-xs text-slate-500">Client ID</label>
              <input
                value={form.client_id}
                onChange={(e) => updateField("client_id", e.target.value)}
                className="w-full mt-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
                placeholder="Client UUID"
              />
            </div>

            {/* SERVICE TYPE */}
            <div>
              <label className="text-xs text-slate-500">Service Type</label>
              <input
                value={form.service_type}
                onChange={(e) => updateField("service_type", e.target.value)}
                className="w-full mt-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
                placeholder="SEO / Web / App / Marketing"
              />
            </div>

            {/* COST */}
            <div>
              <label className="text-xs text-slate-500">Project Cost</label>
              <input
                type="number"
                value={form.project_cost}
                onChange={(e) =>
                  updateField("project_cost", Number(e.target.value))
                }
                className="w-full mt-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="text-xs text-slate-500">Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  updateField("status", e.target.value as ProjectStatus)
                }
                className="w-full mt-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
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
              <label className="text-xs text-slate-500">Priority</label>
              <select
                value={form.priority}
                onChange={(e) =>
                  updateField("priority", e.target.value as ProjectPriority)
                }
                className="w-full mt-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

          </div>
            {/* RIGHT SIDE */}  
                      {/* RIGHT SIDE */}
          <div className="space-y-4">

            {/* START DATE */}
            <div>
              <label className="text-xs text-slate-500">Start Date</label>
              <input
                type="date"
                value={form.start_date ? form.start_date.split("T")[0] : ""}
                onChange={(e) =>
                  updateField("start_date", e.target.value || null)
                }
                className="w-full mt-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              />
            </div>

            {/* END DATE */}
            <div>
              <label className="text-xs text-slate-500">End Date</label>
              <input
                type="date"
                value={form.end_date ? form.end_date.split("T")[0] : ""}
                onChange={(e) =>
                  updateField("end_date", e.target.value || null)
                }
                className="w-full mt-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
              />
            </div>

            {/* PROGRESS */}
            <div>
              <label className="text-xs text-slate-500">
                Progress ({form.progress_percentage}%)
              </label>

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
            </div>

            {/* NOTES */}
            <div>
              <label className="text-xs text-slate-500">Notes</label>
              <textarea
                value={form.notes ?? ""}
                onChange={(e) => updateField("notes", e.target.value)}
                className="w-full mt-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-white"
                rows={6}
                placeholder="Internal project notes..."
              />
            </div>

            {/* ACTIONS */}
            <div className="pt-4 flex gap-3">

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 rounded-lg bg-cyan-600 py-2 text-white hover:bg-cyan-700"
              >
                {loading
                  ? "Saving..."
                  : isEdit
                  ? "Update Project"
                  : "Create Project"}
              </button>

              <button
                onClick={onClose}
                className="flex-1 rounded-lg bg-slate-900 py-2 text-white hover:bg-slate-800"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

        {/* FOOTER SPACING */}
        <div className="h-6" />

      </div>
    </div>
  );
}