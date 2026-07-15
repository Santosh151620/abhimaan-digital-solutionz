"use client";

export default function ActionCenterCard() {
  return (
    <div className="rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-slate-800 bg-slate-950 p-6">
      <h2 className="text-lg font-semibold text-white">
        Attention Required
      </h2>

      <p className="mt-4 text-slate-400">
        No critical actions detected.
      </p>
    </div>
  );
}






