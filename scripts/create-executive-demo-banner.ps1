cd C:\Projects\MDSWEBSITE\abhimaan-digital-solutionz

$file = ".\src\modules\dashboard\components\ExecutiveDemoBanner.tsx"

$content = @'
export default function ExecutiveDemoBanner() {
  return (
    <section className="rounded-2xl border border-teal-500/20 bg-gradient-to-r from-slate-900 to-slate-800 p-5 shadow-xl transition-all duration-300 hover:shadow-teal-500/10 sm:p-6">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-xl font-bold text-white">
            AI-Powered CRM Command Center
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Monitor sales health, opportunities, and intelligent recommendations in one place.
          </p>
        </div>

        <div className="rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-xs font-semibold text-teal-300">
          LIVE INTELLIGENCE
        </div>

      </div>

    </section>
  );
}
'@

Set-Content -LiteralPath $file -Value $content -Encoding UTF8

Write-Host "Executive demo banner created."