"use client";

interface EntityHeaderProps {
  title: string;
  subtitle?: string;
  status?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function EntityHeader({
  title,
  subtitle,
  status,
  actions,
}: EntityHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-950 p-6 lg:flex-row lg:items-center lg:justify-between">

      <div>

        <div className="flex items-center gap-3">

          <h1 className="text-2xl font-bold text-white">
            {title}
          </h1>

          {status}

        </div>

        {subtitle && (
          <p className="mt-2 text-sm text-slate-400">
            {subtitle}
          </p>
        )}

      </div>

      {actions && (
        <div className="flex flex-wrap gap-2">
          {actions}
        </div>
      )}

    </div>
  );
}




