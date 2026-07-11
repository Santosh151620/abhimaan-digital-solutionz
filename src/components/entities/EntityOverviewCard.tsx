"use client";

interface EntityOverviewCardProps {
  title: string;
  value: React.ReactNode;
}

export default function EntityOverviewCard({
  title,
  value,
}: EntityOverviewCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <div className="mt-2 text-2xl font-semibold text-white">
        {value}
      </div>
    </div>
  );
}