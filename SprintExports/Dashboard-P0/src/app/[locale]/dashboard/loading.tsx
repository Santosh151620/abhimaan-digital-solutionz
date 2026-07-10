export default function DashboardLoading() {
  return (
    <main className="min-h-screen space-y-8 bg-slate-950 p-6 text-white">
      <div className="h-10 w-64 animate-pulse rounded-xl bg-slate-800" />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
          />
        ))}
      </div>

      <div className="h-72 animate-pulse rounded-2xl border border-slate-800 bg-slate-900" />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-slate-900" />
        <div className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-slate-900" />
      </div>
    </main>
  );
}
