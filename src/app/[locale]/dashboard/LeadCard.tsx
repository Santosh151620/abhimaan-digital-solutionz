"use client";

import React from "react";

// 1. Define the type structure for a single Lead
type Lead = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  message: string | null;
  source: string | null;
  status: string | null;
  created_at: string;
};

// 2. Define what properties this LeadCard component expects to receive
interface LeadCardProps {
  lead: Lead;
  onViewDetails?: (lead: Lead) => void;
}

// Helper component for managing the status badges beautifully
function StatusPill({ status }: { status?: string | null }) {
  const s = (status || "new").toLowerCase();
  const base = "px-2 py-1 text-xs rounded-full border backdrop-blur-md font-medium";

  const color =
    s === "won"
      ? "bg-green-500/20 text-green-200 border-green-400/30"
      : s === "lost"
      ? "bg-red-500/20 text-red-200 border-red-400/30"
      : "bg-blue-500/20 text-blue-200 border-blue-400/30";

  return <span className={`${base} ${color}`}>{status || "New"}</span>;
}

// 3. The primary exported LeadCard component
export default function LeadCard({ lead, onViewDetails }: LeadCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300">
      {/* Visual background ambient glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />

      {/* NAME & DATE */}
      <div className="flex justify-between items-start gap-2">
        <div className="text-lg font-semibold tracking-wide truncate max-w-[180px]">
          {lead.full_name || "No Name"}
        </div>
        <div className="text-[10px] text-white/40 font-mono self-center">
          {lead.created_at ? lead.created_at.replace("T", " ").slice(0, 19) : "N/A"}
        </div>
      </div>

      {/* CONTACT INFO */}
      <div className="text-sm text-white/70 mt-1 break-words space-y-0.5">
        <div>📧 {lead.email || "-"}</div>
        <div>📞 {lead.phone || "-"}</div>
      </div>

      {/* METADATA TAGS */}
      <div className="flex flex-wrap gap-2 mt-4">
        <span className="px-2 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-medium">
          {lead.service_interest || "Service"}
        </span>

        <span className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/80 border border-white/10">
          {lead.source || "Source"}
        </span>

        <StatusPill status={lead.status} />
      </div>

      {/* MESSAGE SUMMARY TRUNCATION */}
      {lead.message && (
        <div className="text-xs text-white/60 mt-4 line-clamp-2 leading-relaxed italic bg-white/[0.02] p-2 rounded-lg border border-white/5">
          "{lead.message}"
        </div>
      )}

      {/* INTERACTION ACTION BUTTON */}
      {onViewDetails && (
        <button
          onClick={() => onViewDetails(lead)}
          className="mt-4 w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-white py-2 rounded-xl border border-indigo-400/30 text-sm font-medium transition duration-200"
        >
          View Full Details
        </button>
      )}
    </div>
  );
}