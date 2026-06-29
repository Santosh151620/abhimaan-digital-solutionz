export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white animate-pulse">
      <div className="space-y-6">

        <div className="space-y-2">
          <div className="h-8 w-64 rounded-lg bg-slate-800" />
          <div className="h-4 w-80 rounded-lg bg-slate-800" />
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-slate-900 border border-slate-800"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-80 rounded-2xl bg-slate-900 border border-slate-800 lg:col-span-2" />
          <div className="h-80 rounded-2xl bg-slate-900 border border-slate-800" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-slate-900 border border-slate-800"
            />
          ))}
        </div>

      </div>
    </div>
  );
}