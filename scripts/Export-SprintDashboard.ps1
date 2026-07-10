# =====================================================================
# Export-SprintDashboard.ps1
# PowerShell 5.1
# Dashboard Sprint Exporter
# Handles literal folder names like [locale]
# =====================================================================

$ProjectRoot = (Get-Location).Path
$OutputRoot = Join-Path $ProjectRoot "SprintExports"
$ExportRoot = Join-Path $OutputRoot "Dashboard-P0"

if (Test-Path $ExportRoot) {
    Remove-Item $ExportRoot -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $ExportRoot | Out-Null

function Copy-ProjectFile {

    param(
        [string]$RelativePath
    )

    $Source = Join-Path $ProjectRoot $RelativePath

    if (-not (Test-Path -LiteralPath $Source)) {
        Write-Host "Missing : $RelativePath" -ForegroundColor Yellow
        return
    }

    $Destination = Join-Path $ExportRoot $RelativePath

    $Folder = Split-Path $Destination -Parent

    if (!(Test-Path $Folder)) {
        New-Item -ItemType Directory -Force -Path $Folder | Out-Null
    }

    Copy-Item `
        -LiteralPath $Source `
        -Destination $Destination `
        -Force

    Write-Host "Copied : $RelativePath"
}

$Files = @(

"src\app\[locale]\dashboard\page.tsx",
"src\app\[locale]\dashboard\layout.tsx",
"src\app\[locale]\dashboard\loading.tsx",
"src\app\[locale]\dashboard\error.tsx",
"src\app\[locale]\dashboard\RevenueKpiCards.tsx",

"src\app\[locale]\dashboard\components\crm\ExecutivePanel.tsx",
"src\app\[locale]\dashboard\components\crm\PipelineOverview.tsx",
"src\app\[locale]\dashboard\components\crm\PipelineOverviewLegacy.tsx",
"src\app\[locale]\dashboard\components\crm\RevenueForecast.tsx",
"src\app\[locale]\dashboard\components\crm\RevenueKPI.tsx",
"src\app\[locale]\dashboard\components\crm\SalesCopilot.tsx",
"src\app\[locale]\dashboard\components\crm\TodayWorkPanel.tsx"

)

foreach ($File in $Files) {
    Copy-ProjectFile $File
}

$ModuleSource = Join-Path $ProjectRoot "src\modules\dashboard"

if (Test-Path -LiteralPath $ModuleSource) {

    $ModuleDestination = Join-Path $ExportRoot "src\modules"

    if (!(Test-Path $ModuleDestination)) {
        New-Item -ItemType Directory -Force -Path $ModuleDestination | Out-Null
    }

    Copy-Item `
        -LiteralPath $ModuleSource `
        -Destination $ModuleDestination `
        -Recurse `
        -Force

    Write-Host "Copied : src\modules\dashboard"
}

Write-Host ""
Write-Host "=============================================="
Write-Host "Dashboard Export Completed"
Write-Host $ExportRoot
Write-Host "=============================================="