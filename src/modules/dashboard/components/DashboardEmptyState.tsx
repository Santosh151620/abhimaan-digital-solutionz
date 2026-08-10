"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type DashboardEmptyStateProps = {
  title?: string;
  description?: string;
  action?: string;
  actionHref?: string;
};

export default function DashboardEmptyState({
  title = "Your business intelligence starts here",
  description = "Add leads, activities, and opportunities to unlock sales insights.",
  action = "Create your first lead",
  actionHref = "/dashboard/leads",
}: DashboardEmptyStateProps) {
  const router = useRouter();
  const params = useParams<{ locale?: string }>();

  const locale = params?.locale;

  const resolvedActionHref =
    locale && actionHref.startsWith("/")
      ? `/${locale}${actionHref}`
      : actionHref;

  const handleAction = () => {
    router.push(resolvedActionHref);
  };

  return (
    <section
      aria-labelledby="dashboard-empty-state-heading"
      className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        aria-hidden="true"
        className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10"
      >
        <Plus className="h-6 w-6 text-cyan-300" />
      </div>

      <h2
        id="dashboard-empty-state-heading"
        className="text-xl font-semibold text-white"
      >
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
        {description}
      </p>

      <button
        type="button"
        onClick={handleAction}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        {action}
      </button>
    </section>
  );
}
