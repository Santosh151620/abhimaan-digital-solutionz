cd C:\Projects\MDSWEBSITE\abhimaan-digital-solutionz

$file = ".\src\app\[locale]\dashboard\page.tsx"

$content = Get-Content -LiteralPath $file -Raw

$content = $content.Replace(
'bg-slate-950 p-6 text-white',
'bg-slate-950 px-4 py-5 text-white sm:p-6'
)

$content = $content.Replace(
'space-y-8',
'space-y-6 sm:space-y-8'
)

$content = $content.Replace(
'grid gap-6 md:grid-cols-2 xl:grid-cols-4',
'grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4'
)

$content = $content.Replace(
'<ExecutivePanel executive={dashboard.executive} />',
'<section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
        <h1 className="text-xl font-bold sm:text-2xl">
          CRM Intelligence Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Real-time visibility into sales activity, pipeline health, and opportunities.
        </p>
      </section>

      <ExecutivePanel executive={dashboard.executive} />'
)

Set-Content -LiteralPath $file -Value $content -Encoding UTF8

Write-Host "Dashboard responsive polish applied."