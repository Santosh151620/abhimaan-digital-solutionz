# ADS — Architecture Closure Audit
# PowerShell 5.1
# READ-ONLY — makes no changes

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " ADS ARCHITECTURE CLOSURE AUDIT" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

$root = (Get-Location).Path
$src  = Join-Path $root "src"

if (-not (Test-Path $src)) {
    Write-Host "ERROR: src directory not found." -ForegroundColor Red
    exit 1
}

$extensions = @("*.ts", "*.tsx")

function Get-SourceFiles {
    param([string]$Path)

    foreach ($ext in $extensions) {
        Get-ChildItem -Path $Path -Recurse -File -Filter $ext -ErrorAction SilentlyContinue
    }
}

$files = @(Get-SourceFiles $src)

Write-Host "Source files: $($files.Count)" -ForegroundColor Green
Write-Host ""

# ------------------------------------------------------------
# 1. LEGACY IMPORT AUDIT
# ------------------------------------------------------------

Write-Host "------------------------------------------------------------"
Write-Host "1. LEGACY IMPORT AUDIT"
Write-Host "------------------------------------------------------------"

$legacyPatterns = @(
    "@/services/legacy",
    "@/repositories/legacy",
    "@/types/legacy",
    "@/lib/legacy",
    "services/legacy",
    "repositories/legacy",
    "types/legacy",
    "components/legacy",

    "@/services/Lead",
    "@/services/Client",
    "@/services/Notification",
    "@/repositories/Lead",
    "@/repositories/Client",
    "@/repositories/Notification",

    "lead.repository",
    "client.repository",
    "notification.repository",
    "activity.repository",

    "LeadRepository",
    "ClientRepository",
    "NotificationRepository"
)

$legacyHits = @()

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    foreach ($pattern in $legacyPatterns) {
        if ($content -match [regex]::Escape($pattern)) {
            $legacyHits += [PSCustomObject]@{
                File    = $file.FullName.Substring($root.Length + 1)
                Pattern = $pattern
            }
        }
    }
}

if ($legacyHits.Count -eq 0) {
    Write-Host "PASS — No configured legacy import patterns found." -ForegroundColor Green
}
else {
    Write-Host "FAIL — Legacy references found: $($legacyHits.Count)" -ForegroundColor Red
    $legacyHits | Format-Table -AutoSize
}

Write-Host ""

# ------------------------------------------------------------
# 2. DUPLICATE REPOSITORY AUDIT
# ------------------------------------------------------------

Write-Host "------------------------------------------------------------"
Write-Host "2. REPOSITORY AUDIT"
Write-Host "------------------------------------------------------------"

$repoPath = Join-Path $src "repositories"

if (Test-Path $repoPath) {

    $repoFiles = @(Get-ChildItem $repoPath -Recurse -File)

    $repoGroups = $repoFiles |
        Group-Object { $_.BaseName.ToLowerInvariant() } |
        Where-Object { $_.Count -gt 1 }

    if ($repoGroups.Count -eq 0) {
        Write-Host "PASS — No duplicate repository filenames." -ForegroundColor Green
    }
    else {
        Write-Host "REVIEW — Duplicate repository filenames:" -ForegroundColor Yellow

        foreach ($group in $repoGroups) {
            Write-Host ""
            Write-Host "  $($group.Name)" -ForegroundColor Yellow

            foreach ($item in $group.Group) {
                Write-Host "    $($item.FullName.Substring($root.Length + 1))"
            }
        }
    }

}
else {
    Write-Host "WARNING — src/repositories not found." -ForegroundColor Yellow
}

Write-Host ""

# ------------------------------------------------------------
# 3. SERVICE AUDIT
# ------------------------------------------------------------

Write-Host "------------------------------------------------------------"
Write-Host "3. SERVICE AUDIT"
Write-Host "------------------------------------------------------------"

$servicePaths = @(
    (Join-Path $src "services"),
    (Join-Path $src "services/crm")
)

$serviceFiles = @()

foreach ($path in $servicePaths) {
    if (Test-Path $path) {
        $serviceFiles += @(Get-ChildItem $path -Recurse -File)
    }
}

$serviceGroups = $serviceFiles |
    Group-Object { $_.BaseName.ToLowerInvariant() } |
    Where-Object { $_.Count -gt 1 }

if ($serviceGroups.Count -eq 0) {
    Write-Host "PASS — No duplicate service filenames." -ForegroundColor Green
}
else {
    Write-Host "REVIEW — Duplicate service filenames:" -ForegroundColor Yellow

    foreach ($group in $serviceGroups) {
        Write-Host ""
        Write-Host "  $($group.Name)" -ForegroundColor Yellow

        foreach ($item in $group.Group) {
            Write-Host "    $($item.FullName.Substring($root.Length + 1))"
        }
    }
}

Write-Host ""

# ------------------------------------------------------------
# 4. TYPE AUDIT
# ------------------------------------------------------------

Write-Host "------------------------------------------------------------"
Write-Host "4. TYPE AUDIT"
Write-Host "------------------------------------------------------------"

$typesPath = Join-Path $src "types"

if (Test-Path $typesPath) {

    $typeFiles = @(Get-ChildItem $typesPath -Recurse -File -Filter "*.ts")

    $typeGroups = $typeFiles |
        Group-Object { $_.BaseName.ToLowerInvariant() } |
        Where-Object { $_.Count -gt 1 }

    if ($typeGroups.Count -eq 0) {
        Write-Host "PASS — No duplicate type filenames." -ForegroundColor Green
    }
    else {
        Write-Host "REVIEW — Duplicate type filenames:" -ForegroundColor Yellow

        foreach ($group in $typeGroups) {
            Write-Host ""
            Write-Host "  $($group.Name)" -ForegroundColor Yellow

            foreach ($item in $group.Group) {
                Write-Host "    $($item.FullName.Substring($root.Length + 1))"
            }
        }
    }

}
else {
    Write-Host "WARNING — src/types not found." -ForegroundColor Yellow
}

Write-Host ""

# ------------------------------------------------------------
# 5. WEBSITE → CRM COUPLING AUDIT
# ------------------------------------------------------------

Write-Host "------------------------------------------------------------"
Write-Host "5. WEBSITE → CRM COUPLING AUDIT"
Write-Host "------------------------------------------------------------"

$websitePath = Join-Path $src "app/[locale]"

$websiteHits = @()

if (Test-Path $websitePath) {

    $websiteFiles = @(Get-SourceFiles $websitePath)

    foreach ($file in $websiteFiles) {

        $content = Get-Content $file.FullName -Raw

        if (
            $content -match "@/services/crm/" -or
            $content -match "@/repositories/" -or
            $content -match "@/types/crm/" -or
            $content -match "TenantContextManager" -or
            $content -match "organization_id" -or
            $content -match "LeadRepository" -or
            $content -match "CompaniesRepository" -or
            $content -match "ContactsRepository"
        ) {
            $websiteHits += $file.FullName.Substring($root.Length + 1)
        }
    }
}

if ($websiteHits.Count -eq 0) {
    Write-Host "PASS — No obvious Website → CRM coupling found." -ForegroundColor Green
}
else {
    Write-Host "REVIEW — Website files referencing CRM/tenant infrastructure:" -ForegroundColor Yellow

    $websiteHits | ForEach-Object {
        Write-Host "  $_"
    }
}

Write-Host ""

# ------------------------------------------------------------
# 6. ADMIN → CRM COUPLING AUDIT
# ------------------------------------------------------------

Write-Host "------------------------------------------------------------"
Write-Host "6. ADMIN → CRM COUPLING AUDIT"
Write-Host "------------------------------------------------------------"

$adminPath = Join-Path $src "app/admin"
$adminHits = @()

if (Test-Path $adminPath) {

    $adminFiles = @(Get-SourceFiles $adminPath)

    foreach ($file in $adminFiles) {

        $content = Get-Content $file.FullName -Raw

        if (
            $content -match "@/services/crm/" -or
            $content -match "@/types/crm/" -or
            $content -match "LeadRepository" -or
            $content -match "ContactsRepository" -or
            $content -match "CompaniesRepository"
        ) {
            $adminHits += $file.FullName.Substring($root.Length + 1)
        }
    }
}

if ($adminHits.Count -eq 0) {
    Write-Host "PASS — No obvious Admin → CRM coupling found." -ForegroundColor Green
}
else {
    Write-Host "REVIEW — Admin files referencing CRM:" -ForegroundColor Yellow

    $adminHits | ForEach-Object {
        Write-Host "  $_"
    }
}

Write-Host ""

# ------------------------------------------------------------
# 7. ENTITY-NAMING AUDIT
# ------------------------------------------------------------

Write-Host "------------------------------------------------------------"
Write-Host "7. ENTITY NAMING AUDIT"
Write-Host "------------------------------------------------------------"

$entityHits = @()

foreach ($file in $files) {

    $content = Get-Content $file.FullName -Raw

    if (
        $content -match "\bleadId\b" -or
        $content -match "\bclientId\b" -or
        $content -match "\bprojectId\b" -or
        $content -match "\bcompanyId\b" -or
        $content -match "\bcontactId\b"
    ) {

        $entityHits += $file.FullName.Substring($root.Length + 1)
    }
}

if ($entityHits.Count -eq 0) {
    Write-Host "PASS — No obvious legacy entity-specific ID references." -ForegroundColor Green
}
else {
    Write-Host "REVIEW — Entity-specific ID references found:" -ForegroundColor Yellow

    $entityHits | Sort-Object -Unique | ForEach-Object {
        Write-Host "  $_"
    }
}

Write-Host ""

# ------------------------------------------------------------
# 8. DUPLICATE CLASS / EXPORT NAME SEARCH
# ------------------------------------------------------------

Write-Host "------------------------------------------------------------"
Write-Host "8. DUPLICATE CLASS / INTERFACE NAME AUDIT"
Write-Host "------------------------------------------------------------"

$symbols = @()

foreach ($file in $files) {

    $lines = Get-Content $file.FullName

    foreach ($line in $lines) {

        if (
            $line -match "^\s*(export\s+)?(class|interface|type)\s+([A-Za-z0-9_]+)"
        ) {

            $symbols += [PSCustomObject]@{
                Name = $Matches[3]
                File = $file.FullName.Substring($root.Length + 1)
            }
        }
    }
}

$duplicateSymbols = $symbols |
    Group-Object Name |
    Where-Object { $_.Count -gt 1 }

if ($duplicateSymbols.Count -eq 0) {
    Write-Host "PASS — No duplicate class/interface/type declarations detected." -ForegroundColor Green
}
else {
    Write-Host "REVIEW — Duplicate symbols detected:" -ForegroundColor Yellow

    foreach ($group in $duplicateSymbols) {

        Write-Host ""
        Write-Host "  $($group.Name)" -ForegroundColor Yellow

        foreach ($item in $group.Group) {
            Write-Host "    $($item.File)"
        }
    }
}

Write-Host ""

# ------------------------------------------------------------
# SUMMARY
# ------------------------------------------------------------

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " ARCHITECTURE AUDIT COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Legacy hits:              $($legacyHits.Count)"
Write-Host "Website coupling hits:    $($websiteHits.Count)"
Write-Host "Admin coupling hits:      $($adminHits.Count)"
Write-Host "Entity-ID review hits:    $($entityHits.Count)"
Write-Host "Duplicate symbols:        $($duplicateSymbols.Count)"
Write-Host ""

Write-Host "IMPORTANT:" -ForegroundColor Yellow
Write-Host "This audit is READ-ONLY."
Write-Host "Do not delete or modify files based on individual findings yet."
Write-Host "We will classify the complete result first."
Write-Host ""
Write-Host "NEXT: paste the COMPLETE terminal output." -ForegroundColor Cyan