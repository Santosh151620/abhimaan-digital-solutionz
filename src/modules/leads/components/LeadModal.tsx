"use client";

import { useState } from "react";

import EntityWorkspace from "@/components/entities/EntityWorkspace";

import type { Lead, LeadStatus } from "@/types/lead";

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
  
  const [status, setStatus] = useState<LeadStatus>(
  lead?.status ?? "new"
);
  const [loading, setLoading] = useState(false);


  if (!isOpen || !lead) {
    return null;
  }

 async function handleSave() {
  if (!lead) return;

  const leadId = lead.id;

  setLoading(true);

  try {
    await onUpdateStatus(leadId, status);
    onClose();
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60">
     <div
  key={lead.id}
  className="mx-auto my-10 w-full max-w-6xl rounded-xl bg-slate-900 shadow-2xl"
>
        <div className="border-b border-slate-800 p-6">
          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-2xl font-semibold text-white">
                {lead.full_name ?? "Lead"}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {lead.email ?? "-"}
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white hover:bg-slate-700"
            >
              Close
            </button>

          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[360px_1fr]">

          <div className="space-y-6">

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

              <h3 className="mb-4 text-lg font-semibold text-white">
                Lead Details
              </h3>

              <div className="space-y-3">

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Name
                  </p>

                  <p className="text-white">
                    {lead.full_name ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Email
                  </p>

                  <p className="text-white">
                    {lead.email ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Status
                  </p>

                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as LeadStatus)
                    }
                    className="mt-2 w-full rounded-lg bg-slate-800 p-2 text-white"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>

                </div>

              </div>

              <button
                onClick={handleSave}
                disabled={loading}
                className="mt-6 w-full rounded-lg bg-cyan-600 px-4 py-3 font-medium text-white disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </div>

          <div>

            <EntityWorkspace
              activities={[]}
              notes={[]}
              tasks={[]}
              attachments={[]}
              notifications={[]}
            />

          </div>

        </div>

      </div>
    </div>
  );
}
