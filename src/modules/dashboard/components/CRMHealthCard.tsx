"use client";

export default function CRMHealthCard() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
      <h2 className="text-lg font-semibold text-white">
        CRM Health
      </h2>

      <div className="mt-4 space-y-3 text-sm text-slate-300">
        <p>? Lead pipeline active</p>
        <p>? Customer data connected</p>
        <p>? Workflow engine available</p>
      </div>
    </div>
  );
}
