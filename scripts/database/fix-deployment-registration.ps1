# ============================================================
# ADS Migration Deployment Registration Validator
# File: fix-deployment-registration.ps1
# PowerShell: 5.1 Compatible
# ============================================================

$ErrorActionPreference = "Stop"

$RootPath = Resolve-Path "$PSScriptRoot\..\.."
$MigrationPath = Join-Path $RootPath "supabase\migrations"

Write-Host ""
Write-Host "============================================================"
Write-Host " ADS MIGRATION DEPLOYMENT REGISTRATION CHECK"
Write-Host "============================================================"
Write-Host ""

$migrations = Get-ChildItem `
    -Path $MigrationPath `
    -Filter "*.sql" `
    | Sort-Object Name


$versions = @()

foreach ($migration in $migrations) {

    if ($migration.Name -match "^(\d{3})_") {

        $versions += [int]$Matches[1]

    }

}


$duplicates = $versions |
    Group-Object |
    Where-Object {
        $_.Count -gt 1
    }


$missing = @()

for ($i = 1; $i -le 40; $i++) {

    if ($versions -notcontains $i) {

        $missing += $i

    }

}


Write-Host "Migration files detected:"
Write-Host $versions.Count
Write-Host ""


if ($duplicates.Count -eq 0) {

    Write-Host "Duplicate versions : PASS"

}
else {

    Write-Host "Duplicate versions : FAILED"

    foreach ($item in $duplicates) {

        Write-Host "[FAIL] Version $($item.Name)"

    }

}


Write-Host ""


if ($missing.Count -eq 0) {

    Write-Host "Missing versions : PASS"

}
else {

    Write-Host "Missing versions : FAILED"

    foreach ($item in $missing) {

        Write-Host "[FAIL] Missing migration $item"

    }

}


Write-Host ""
Write-Host "============================================================"


if (
    $duplicates.Count -eq 0 -and
    $missing.Count -eq 0
) {

    Write-Host "STATUS: DEPLOYMENT REGISTRATION READY"
    exit 0

}
else {

    Write-Host "STATUS: REGISTRATION REVIEW REQUIRED"
    exit 1

}