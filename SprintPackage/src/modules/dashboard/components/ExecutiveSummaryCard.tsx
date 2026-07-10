"use client";

export default function ExecutiveSummaryCard() {
  return (
    <div className="rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-slate-800 bg-slate-950 p-6">
      <h2 className="text-lg font-semibold text-white">
        Executive Summary
      </h2>

      <div className="mt-4 grid gap-4 md:grid-cols-4">
        <Metric label="Leads" value="--" />
        <Metric label="Clients" value="--" />
        <Metric label="Projects" value="--" />
        <Metric label="Revenue" value="--" />
      </div>
    </div>
  );
}

function Metric({label,value}:{label:string;value:string}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-xs text-slate-500 uppercase">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

