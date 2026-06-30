"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { LeadStatus} from "@/types/lead";
import type { Lead } from "@/types/lead";

const supabase = createClient();

interface LeadModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onUpdateStatus: (
    leadId: string,
    status: LeadStatus
  ) => Promise<void> | void;
}

export default function LeadModal({
  isOpen,
  lead,
  onClose,
  onUpdateStatus,
}: LeadModalProps) {
  const [status, setStatus] = useState<LeadStatus>("new");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setStatus(lead.status);
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  async function handleSave() {
    setLoading(true);
    if (!lead) return;
    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", lead.id);

    if (!error) {
      await onUpdateStatus(lead.id, status);
      onClose();
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[420px] rounded-xl bg-slate-900 p-6">
        <h2 className="mb-4 text-xl text-white">
          Lead Details
        </h2>

        <p className="mb-2 text-slate-300">
          {lead.full_name ?? "-"}
        </p>

        <p className="mb-4 text-slate-400">
          {lead.email ?? "-"}
        </p>

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as LeadStatus)
          }
          className="w-full rounded bg-slate-800 p-2 text-white"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded bg-gray-600 px-3 py-2 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded bg-cyan-600 px-3 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}