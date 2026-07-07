cd C:\Projects\MDSWEBSITE\abhimaan-digital-solutionz

$file = ".\src\modules\dashboard\components\DashboardEmptyState.tsx"

$content = @'
type DashboardEmptyStateProps = {
  title?: string;
  description?: string;
  action?: string;
};

export default function DashboardEmptyState({
  title = "Your CRM intelligence starts here",
  description = "Add leads, activities, and opportunities to unlock sales insights.",
  action = "Create your first lead",
}: DashboardEmptyStateProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">

      <div className="mb-4 text-5xl">
        📊
      </div>

      <h2 className="text-xl font-semibold text-white">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
        {description}
      </p>

      <button
        className="mt-6 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
      >
        {action}
      </button>

    </section>
  );
}
'@

Set-Content -LiteralPath $file -Value $content -Encoding UTF8

Write-Host "Dashboard empty state created."