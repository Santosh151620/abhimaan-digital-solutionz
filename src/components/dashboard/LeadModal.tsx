"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  LeadStatus,
  LeadTableItem,
} from "@/components/dashboard/LeadTable";

const supabase = createClient();

/* ================= TYPES ================= */

interface LeadNote {
  id: string;
  lead_id: string;
  note: string;
  created_at: string;
}

interface LeadTimelineItem {
  id: string;
  lead_id: string;
  message: string;
  event_type: string;
  created_at: string;
}

interface LeadModalProps {
  lead: LeadTableItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
}

const STATUS_OPTIONS: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
];

/* ================= COMPONENT ================= */

export default function LeadModal({
  lead,
  isOpen,
  onClose,
  onUpdateStatus,
}: LeadModalProps) {
  const [status, setStatus] = useState<LeadStatus>("new");
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [timeline, setTimeline] = useState<LeadTimelineItem[]>([]);
  const [newNote, setNewNote] = useState("");

  const [savingNote, setSavingNote] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (!lead) return;

    setStatus(lead.status as LeadStatus);
    loadData();
  }, [lead?.id]);

  if (!isOpen || !lead) return null;

  async function loadData() {
    setLoading(true);

    const [t, n] = await Promise.all([
      supabase
        .from("lead_timeline")
        .select("*")
        .eq("lead_id", lead.id)
        .order("created_at", { ascending: false }),

      supabase
        .from("lead_notes")
        .select("*")
        .eq("lead_id", lead.id)
        .order("created_at", { ascending: false }),
    ]);

    setTimeline((t.data as LeadTimelineItem[]) || []);
    setNotes((n.data as LeadNote[]) || []);

    setLoading(false);
  }

  /* ================= NOTES ================= */

  async function addNote() {
    if (!lead || !newNote.trim()) return;

    setSavingNote(true);

    try {
      const { error } = await supabase.from("lead_notes").insert({
        lead_id: lead.id,
        note: newNote.trim(),
      });

      if (!error) {
        await supabase.from("lead_timeline").insert({
          lead_id: lead.id,
          message: "Note added",
          event_type: "note",
        });

        setNewNote("");
        await loadData();
      }
    } finally {
      setSavingNote(false);
    }
  }

  /* ================= STATUS ================= */

  function handleStatusChange(value: LeadStatus) {
    setStatus(value);
  }

  async function saveStatus() {
    if (!lead) return;

    await onUpdateStatus(lead.id, status);

    await supabase.from("lead_timeline").insert({
      lead_id: lead.id,
      message: `Status updated to ${status}`,
      event_type: "status_change",
    });

    await loadData();
  }

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="w-full max-w-5xl rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Lead Details
            </h2>
            <p className="text-sm text-slate-400">
              Manage lead activity and status
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

            <div>
              <p className="text-xs text-slate-500">Name</p>
              <p className="text-white">
                {lead.full_name || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-white">
                {lead.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Phone</p>
              <p className="text-white">
                {lead.phone || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Company</p>
              <p className="text-white">
                {lead.company || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Service Interest
              </p>
              <p className="text-white">
                {lead.service_interest || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Created</p>
              <p className="text-white">
                {lead.created_at.split("T")[0]}
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
                  handleStatusChange(
                    e.target.value as LeadStatus
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

              <button
                onClick={saveStatus}
                className="mt-3 w-full rounded-lg bg-cyan-600 py-2 text-white hover:bg-cyan-700"
              >
                Save Status
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* NOTES */}
            <div>
              <textarea
                value={newNote}
                onChange={(e) =>
                  setNewNote(e.target.value)
                }
                placeholder="Add internal note..."
                className="w-full rounded-lg border border-white/10 bg-slate-900 p-3 text-white"
              />

              <button
                onClick={addNote}
                disabled={savingNote}
                className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                {savingNote ? "Saving..." : "Add Note"}
              </button>

              <div className="mt-4 space-y-2">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-lg bg-slate-900 p-3 text-sm text-white"
                  >
                    {n.note}
                  </div>
                ))}
              </div>
            </div>

            {/* TIMELINE */}
            <div>
              <h3 className="text-sm text-slate-400 mb-2">
                Timeline
              </h3>

              <div className="space-y-2">
                {timeline.map((t) => (
                  <div
                    key={t.id}
                    className="text-xs text-slate-400"
                  >
                    {t.message}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}