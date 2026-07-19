import type { ReactNode } from "react";

interface Props {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function CRMPageLayout({
  title,
  subtitle,
  actions,
  children,
}: Props) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {(title || actions) && (
        <div className="rounded-3xl border border-white/10 bg-white/70 backdrop-blur-xl shadow-xl">

          <div className="flex flex-col gap-5 p-8 lg:flex-row lg:items-center lg:justify-between">

            <div>

              {title && (
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {title}
                </h1>
              )}

              {subtitle && (
                <p className="mt-2 text-sm text-slate-500">
                  {subtitle}
                </p>
              )}

            </div>

            {actions && (
              <div className="flex flex-wrap gap-3">
                {actions}
              </div>
            )}

          </div>

        </div>
      )}

      <div className="space-y-6">
        {children}
      </div>

    </div>
  );
}