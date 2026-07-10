"use client";

type DashboardErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function DashboardError({
  reset,
}: DashboardErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
        <div className="mb-6 text-6xl">
          ⚠️
        </div>

        <h1 className="mb-3 text-3xl font-bold text-white">
          Dashboard Unavailable
        </h1>

        <p className="mb-8 text-slate-400">
          We couldn&apos;t load your CRM dashboard right now.
          This is usually temporary.
          Please try again.
        </p>

        <button
          onClick={reset}
          className="rounded-xl bg-teal-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-teal-400"
        >
          Retry
        </button>
      </div>
    </div>
  );
}