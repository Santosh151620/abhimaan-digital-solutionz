"use client";

import { useEffect, useState } from "react";
import LeadNotes from "./LeadNotes";
import LeadTimeline from "./LeadTimeline";

const STATUS_OPTIONS = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];

type Lead = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  message: string | null;
  status: string | null;
  created_at: string;
};

export default function LeadCard({ lead }: { lead: Lead }) {
  const [showModal, setShowModal] = useState(false);

  const createdDate = lead.created_at
    ? lead.created_at.split("T")[0]
    : "-";

  const createdDateTime = lead.created_at
    ? lead.created_at.replace("T", " ").slice(0, 19)
    : "-";

  useEffect(() => {
    if (!showModal) return;

    document.body.style.overflow = "hidden";

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [showModal]);

  const badgeClass =
    lead.status === "Won"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : lead.status === "Lost"
      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
      : lead.status === "Proposal Sent"
      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
      : "bg-sky-500/10 text-sky-400 border-sky-500/20";

  return (
    <>
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">
              {lead.full_name || "Anonymous Lead"}
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Lead ID: {String(lead.id).slice(0, 8)}...
            </p>
          </div>

          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${badgeClass}`}
          >
            {lead.status || "New"}
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Company</span>
            <span className="text-slate-300">
              {lead.company || "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Email</span>
            <span className="text-slate-300">
              {lead.email}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Phone</span>
            <span className="text-slate-300">
              {lead.phone || "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Service</span>
            <span className="text-teal-400">
              {lead.service_interest || "-"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Created</span>
            <span className="text-slate-300">
              {createdDate}
            </span>
          </div>

          {lead.message && (
            <div className="pt-3 border-t border-slate-800">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                Client Brief
              </p>

              <p className="text-slate-400 text-xs italic line-clamp-3">
                "{lead.message}"
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-4 py-2 rounded-lg"
            >
              View Lead Details
            </button>
          </div>

          <form
            action="/api/leads/update-status"
            method="POST"
            className="flex items-center gap-3"
          >
            <input type="hidden" name="id" value={lead.id} />

            <select
              name="status"
              defaultValue={lead.status || "New"}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-sm font-semibold"
            >
              Apply
            </button>
          </form>
        </div>
      </div>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-2xl font-bold text-white">
                Lead Details
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-8 max-h-[85vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <Info label="Full Name" value={lead.full_name || "-"} />
                  <Info label="Email" value={lead.email || "-"} />
                  <Info label="Phone" value={lead.phone || "-"} />
                  <Info label="Company" value={lead.company || "-"} />
                  <Info
                    label="Service Interest"
                    value={lead.service_interest || "-"}
                  />
                  <Info
                    label="Current Status"
                    value={lead.status || "New"}
                  />
                  <Info label="Lead ID" value={lead.id} />
                  <Info label="Created Date" value={createdDateTime} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                    Full Message
                  </p>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="text-slate-300 whitespace-pre-wrap">
                      {lead.message || "No message submitted."}
                    </p>
                  </div>
                  {/* Lead Notes */}

<div className="pt-4 border-t border-slate-800">
  <h3 className="text-lg font-semibold text-white mb-3">
    Internal Notes
  </h3>

  <LeadNotes leadId={lead.id} />
</div>

{/* Lead Timeline */}

<div className="pt-4 border-t border-slate-800">
  <h3 className="text-lg font-semibold text-white mb-3">
    Activity Timeline
  </h3>

  <LeadTimeline leadId={lead.id} />
</div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Internal Notes
                  </h3>

                  <LeadNotes leadId={lead.id} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Activity Timeline
                  </h3>

                  <LeadTimeline leadId={lead.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
        {label}
      </p>

      <p className="text-slate-200 break-all">
        {value}
      </p>
    </div>
  );
}