$ErrorActionPreference="Stop"

$page="src\app\[locale]\dashboard\page.tsx"

$content=[System.IO.File]::ReadAllText((Resolve-Path -LiteralPath $page))

# ---------- Imports ----------

$imports=@'
import { AIInsightsPanel } from "@/modules/dashboard/ai";
import NotificationSummary from "@/modules/dashboard/notifications/NotificationSummary";
import LiveActivityTicker from "@/modules/dashboard/live/LiveActivityTicker";

'@

if($content -notmatch "AIInsightsPanel"){
    $content=$imports + $content
}

# ---------- Insert AI section once ----------

if($content -notmatch "<AIInsightsPanel"){

$marker='      <section className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-6">'

$block=@'

      <section className="grid gap-6 xl:grid-cols-3">

        <AIInsightsPanel />

        <NotificationSummary />

        <LiveActivityTicker />

      </section>

      <section className="rounded-2xl border border-emerald-500/20 bg-slate-900 p-6">
'@

$content=$content.Replace($marker,$block)

}

[System.IO.File]::WriteAllText((Resolve-Path -LiteralPath $page),$content)

Write-Host "Dashboard AI V3 wired."