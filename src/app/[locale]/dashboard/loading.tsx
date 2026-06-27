export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="space-y-6 animate-pulse">

        {/* Header */}
        <div className="space-y-2">
          <div className="h-8 w-72 rounded bg-slate-800" />
          <div className="h-4 w-96 rounded bg-slate-800" />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 rounded-2xl border border-slate-800 bg-slate-900"
            />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-96 rounded-2xl border border-slate-800 bg-slate-900 lg:col-span-2" />

          <div className="h-96 rounded-2xl border border-slate-800 bg-slate-900" />
        </div>

        {/* CRM Section */}
        <div className="space-y-4">
          <div className="h-6 w-64 rounded bg-slate-800" />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-28 rounded-xl border border-slate-800 bg-slate-900"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}