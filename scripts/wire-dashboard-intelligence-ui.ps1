$root = Get-Location

$page = Join-Path $root "src\app\[locale]\dashboard\page.tsx"

if (!(Test-Path -LiteralPath $page)) {
    Write-Host "Dashboard page missing"
    exit 1
}

$content = [System.IO.File]::ReadAllText($page)

if ($content -notmatch "ExecutiveSummaryCard") {

$imports = @"
import ExecutiveSummaryCard from "@/modules/dashboard/components/ExecutiveSummaryCard";
import CRMHealthCard from "@/modules/dashboard/components/CRMHealthCard";
import PipelineIntelligenceCard from "@/modules/dashboard/components/PipelineIntelligenceCard";
import ActionCenterCard from "@/modules/dashboard/components/ActionCenterCard";

"@

$content = $imports + $content

$insert = @"

<div className="space-y-6 mb-8">
  <ExecutiveSummaryCard />

  <div className="grid gap-6 md:grid-cols-2">
    <CRMHealthCard />
    <PipelineIntelligenceCard />
    <ActionCenterCard />
  </div>
</div>

"@

$content = $content.Replace(
"<main",
"<main`r`n$insert"
)

[System.IO.File]::WriteAllText($page,$content)

}

Write-Host "Dashboard Intelligence UI wired"