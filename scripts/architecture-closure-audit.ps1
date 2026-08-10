# ADS — Architecture Closure Audit
# Strict PowerShell 5.1 compatible
# READ-ONLY

$ErrorActionPreference = "Stop"

$root = (Get-Location).Path
$src  = Join-Path $root "src"

function Get-Text {
    param([string]$Path)

    return ([System.IO.File]::ReadAllText($Path))
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " ADS ARCHITECTURE CLOSURE AUDIT" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $src)) {
    Write-Host "ERROR: src directory not found." -ForegroundColor Red
    exit 1
}

$files = @(Get-ChildItem $src -Recurse -File |
    Where-Object {
        $_.Extension -eq ".ts" -or
        $_.Extension -eq ".tsx"
    })

Write-Host "Source files: $($files.Count)" -ForegroundColor Green
Write-Host ""

# ============================================================
# 1. LEGACY REFERENCE AUDIT
# ============================================================

Write-Host "------------------------------------------------------------"
Write-Host "1. LEGACY REFERENCE AUDIT"
Write-Host "------------------------------------------------------------"

$patterns = @(
    "lead.repository",
    "client.repository",
    "notification.repository",
    "LeadRepository",
    "ClientRepository",
    "NotificationRepository",
    "activities.repository",
    "ActivityRepository",
    "services/legacy",
    "repositories/legacy",
    "types/legacy",
    "@/services/Lead",
    "@/services/Client",
    "@/services/Notification"
)

$hits = @()

foreach ($file in $files) {

    $content = Get-Text $file.FullName

    foreach ($pattern in $patterns) {

        # Path-style legacy references should be matched literally.
        $isPathPattern = $pattern.Contains("/") -or $pattern.Contains("@")

        if ($isPathPattern) {

            if ($content.IndexOf(
                $pattern,
                [System.StringComparison]::OrdinalIgnoreCase
            ) -ge 0) {

                $hits += [PSCustomObject]@{
                    File  = $file.FullName.Substring($root.Length + 1)
                    Match = $pattern
                }
            }

            continue
        }

        # Identifier-style references must be matched as complete
        # identifiers, not as substrings.
        #
        # Example:
        #   LeadRepository       -> MATCH
        #   LeadRepositoryContract -> NO MATCH
        #   MyLeadRepository     -> NO MATCH
        $escapedPattern = [regex]::Escape($pattern)

        if ($content -match "(?<![A-Za-z0-9_$])$escapedPattern(?![A-Za-z0-9_$])") {

            $hits += [PSCustomObject]@{
                File  = $file.FullName.Substring($root.Length + 1)
                Match = $pattern
            }
        }
    }
}

if ($hits.Count -eq 0) {
    Write-Host "PASS — No configured legacy references found." -ForegroundColor Green
}
else {
    Write-Host "REVIEW — Legacy references:" -ForegroundColor Yellow
    $hits | Format-Table -AutoSize
}

Write-Host ""

# ============================================================
# 2. REPOSITORY DUPLICATE AUDIT
# ============================================================

Write-Host "------------------------------------------------------------"
Write-Host "2. REPOSITORY DUPLICATE AUDIT"
Write-Host "------------------------------------------------------------"

$repoPath = Join-Path $src "repositories"

if (Test-Path $repoPath) {

    $repoFiles = @(Get-ChildItem $repoPath -Recurse -File)

    # Compare repository filenames only within the same module boundary.
    # admin/SettingsRepository.ts and crm/SettingsRepository.ts are
    # intentionally independent repositories and are therefore NOT
    # architectural duplicates.
    $groups = $repoFiles |
        Group-Object {
            $relative = $_.FullName.Substring($repoPath.Length + 1)
            $parts = $relative -split '[\\/]'

            if ($parts.Count -gt 1) {
                "$($parts[0].ToLowerInvariant())::$($_.BaseName.ToLowerInvariant())"
            }
            else {
                "root::$($_.BaseName.ToLowerInvariant())"
            }
        } |
        Where-Object { $_.Count -gt 1 }

    if ($groups.Count -eq 0) {

        Write-Host "PASS — No duplicate repository filenames within module boundaries." -ForegroundColor Green

    }
    else {

        foreach ($group in $groups) {

            Write-Host ""
            Write-Host "DUPLICATE: $($group.Name)" -ForegroundColor Yellow

            foreach ($item in $group.Group) {
                Write-Host "  $($item.FullName.Substring($root.Length + 1))"
            }
        }
    }
}
else {
    Write-Host "WARNING — src/repositories does not exist." -ForegroundColor Yellow
}

Write-Host ""

# ============================================================
# 3. SERVICE DUPLICATE AUDIT
# ============================================================

Write-Host "------------------------------------------------------------"
Write-Host "3. SERVICE DUPLICATE AUDIT"
Write-Host "------------------------------------------------------------"

$servicePath = Join-Path $src "services"

if (Test-Path $servicePath) {

    $serviceFiles = @(Get-ChildItem $servicePath -Recurse -File)

    # Compare service filenames only within the same module boundary.
    # admin/SettingsService.ts and crm/SettingsService.ts are intentionally
    # independent services and are therefore NOT architectural duplicates.
    $groups = $serviceFiles |
        Group-Object {
            $relative = $_.FullName.Substring($servicePath.Length + 1)
            $parts = $relative -split '[\\/]'

            if ($parts.Count -gt 1) {
                "$($parts[0].ToLowerInvariant())::$($_.BaseName.ToLowerInvariant())"
            }
            else {
                "root::$($_.BaseName.ToLowerInvariant())"
            }
        } |
        Where-Object { $_.Count -gt 1 }

    if ($groups.Count -eq 0) {

        Write-Host "PASS — No duplicate service filenames within module boundaries." -ForegroundColor Green

    }
    else {

        foreach ($group in $groups) {

            Write-Host ""
            Write-Host "DUPLICATE: $($group.Name)" -ForegroundColor Yellow

            foreach ($item in $group.Group) {
                Write-Host "  $($item.FullName.Substring($root.Length + 1))"
            }
        }
    }
}
else {
    Write-Host "WARNING — src/services does not exist." -ForegroundColor Yellow
}

Write-Host ""

# ============================================================
# 4. TYPE DUPLICATE AUDIT
# ============================================================

Write-Host "------------------------------------------------------------"
Write-Host "4. TYPE DUPLICATE AUDIT"
Write-Host "------------------------------------------------------------"

$typePath = Join-Path $src "types"

if (Test-Path $typePath) {

    $typeFiles = @(Get-ChildItem $typePath -Recurse -File -Filter "*.ts")

    # Compare type filenames only within the same module boundary.
    #
    # Examples:
    #   src/types/activity.ts
    #   src/types/crm/Activity.ts
    #
    # These belong to different architectural boundaries and are therefore
    # NOT automatically duplicates.
    #
    # Likewise:
    #   src/types/admin/Workflow.ts
    #   src/types/workflow/Workflow.ts
    #
    # are independently scoped until actual semantic duplication is proven.
    #
    # Root-level types use the "root" boundary.
    $groups = $typeFiles |
        Group-Object {
            $relative = $_.FullName.Substring($typePath.Length + 1)
            $parts = $relative -split '[\\/]'

            if ($parts.Count -gt 1) {
                "$($parts[0].ToLowerInvariant())::$($_.BaseName.ToLowerInvariant())"
            }
            else {
                "root::$($_.BaseName.ToLowerInvariant())"
            }
        } |
        Where-Object { $_.Count -gt 1 }

    if ($groups.Count -eq 0) {

        Write-Host "PASS — No duplicate type filenames within module boundaries." -ForegroundColor Green

    }
    else {

        foreach ($group in $groups) {

            Write-Host ""
            Write-Host "DUPLICATE: $($group.Name)" -ForegroundColor Yellow

            foreach ($item in $group.Group) {
                Write-Host "  $($item.FullName.Substring($root.Length + 1))"
            }
        }
    }
}
else {
    Write-Host "WARNING — src/types does not exist." -ForegroundColor Yellow
}

Write-Host ""

# ============================================================
# 5. WEBSITE → CRM COUPLING
# ============================================================

Write-Host "------------------------------------------------------------"
Write-Host "5. WEBSITE → CRM COUPLING AUDIT"
Write-Host "------------------------------------------------------------"

$websitePath = Join-Path $src "app/[locale]"
$websiteHits = @()

if (Test-Path $websitePath) {

    $websiteFiles = @(Get-ChildItem $websitePath -Recurse -File |
        Where-Object {
            $_.Extension -eq ".ts" -or
            $_.Extension -eq ".tsx"
        })

    foreach ($file in $websiteFiles) {

        $content = Get-Text $file.FullName

        if (
            $content.IndexOf("@/services/crm/", [System.StringComparison]::OrdinalIgnoreCase) -ge 0 -or
            $content.IndexOf("@/types/crm/", [System.StringComparison]::OrdinalIgnoreCase) -ge 0 -or
            $content.IndexOf("TenantContextManager", [System.StringComparison]::OrdinalIgnoreCase) -ge 0 -or
            $content.IndexOf("organization_id", [System.StringComparison]::OrdinalIgnoreCase) -ge 0
        ) {

            $websiteHits += $file.FullName.Substring($root.Length + 1)
        }
    }
}

if ($websiteHits.Count -eq 0) {

    Write-Host "PASS — No obvious Website → CRM coupling." -ForegroundColor Green

}
else {

    Write-Host "REVIEW — Website → CRM references:" -ForegroundColor Yellow

    $websiteHits |
        Sort-Object -Unique |
        ForEach-Object {
            Write-Host "  $_"
        }
}

Write-Host ""

# ============================================================
# 6. ADMIN → CRM COUPLING
# ============================================================

Write-Host "------------------------------------------------------------"
Write-Host "6. ADMIN → CRM COUPLING AUDIT"
Write-Host "------------------------------------------------------------"

$adminPath = Join-Path $src "app/admin"
$adminHits = @()

if (Test-Path $adminPath) {

    $adminFiles = @(Get-ChildItem $adminPath -Recurse -File |
        Where-Object {
            $_.Extension -eq ".ts" -or
            $_.Extension -eq ".tsx"
        })

    foreach ($file in $adminFiles) {

        $content = Get-Text $file.FullName

        if (
            $content.IndexOf("@/services/crm/", [System.StringComparison]::OrdinalIgnoreCase) -ge 0 -or
            $content.IndexOf("@/types/crm/", [System.StringComparison]::OrdinalIgnoreCase) -ge 0 -or
            $content.IndexOf("TenantContextManager", [System.StringComparison]::OrdinalIgnoreCase) -ge 0
        ) {

            $adminHits += $file.FullName.Substring($root.Length + 1)
        }
    }
}

if ($adminHits.Count -eq 0) {

    Write-Host "PASS — No obvious Admin → CRM coupling." -ForegroundColor Green

}
else {

    Write-Host "REVIEW — Admin → CRM references:" -ForegroundColor Yellow

    $adminHits |
        Sort-Object -Unique |
        ForEach-Object {
            Write-Host "  $_"
        }
}

Write-Host ""

# ============================================================
# 7. ENTITY ID AUDIT
# ============================================================

Write-Host "------------------------------------------------------------"
Write-Host "7. ENTITY ID AUDIT"
Write-Host "------------------------------------------------------------"

$entityHits = @()

# Entity-specific IDs are only an architectural violation when they
# cross into shared infrastructure.
#
# Domain-owned modules are allowed to use their own domain identifiers.
# Example:
#   src/modules/leads       -> leadId is legitimate domain context
#   src/modules/projects    -> projectId is legitimate domain context
#
# Shared infrastructure must instead use:
#   entityType + entityId
#
# Therefore this audit intentionally checks only shared architectural
# boundaries and root-level shared services/types.

$sharedAuditRoots = @(
    (Join-Path $src "lib"),
    (Join-Path $src "repositories"),
    (Join-Path $src "services"),
    (Join-Path $src "types")
)

$entityPatterns = @(
    "\bleadId\b",
    "\bclientId\b",
    "\bprojectId\b"
)

foreach ($auditRoot in $sharedAuditRoots) {

    if (-not (Test-Path $auditRoot)) {
        continue
    }

    $auditFiles = @(Get-ChildItem $auditRoot -Recurse -File |
        Where-Object {
            $_.Extension -eq ".ts" -or
            $_.Extension -eq ".tsx"
        })

    foreach ($file in $auditFiles) {

        $content = Get-Text $file.FullName

        foreach ($pattern in $entityPatterns) {

            if ($content -match $pattern) {

                $relativePath =
                    $file.FullName.Substring($root.Length + 1)

                $entityHits += [PSCustomObject]@{
                    File  = $relativePath
                    Match = $pattern
                }

                break
            }
        }
    }
}

if ($entityHits.Count -eq 0) {

    Write-Host "PASS — No entity-specific IDs found in shared architectural boundaries." -ForegroundColor Green

}
else {

    Write-Host "REVIEW — Entity-specific IDs found in shared boundaries:" -ForegroundColor Yellow

    $entityHits |
        Sort-Object File, Match -Unique |
        ForEach-Object {
            Write-Host "  $($_.File) [$($_.Match)]"
        }
}

Write-Host ""

# ============================================================
# SUMMARY
# ============================================================

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " ARCHITECTURE AUDIT COMPLETE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Legacy references:  $($hits.Count)"
Write-Host "Website coupling:   $($websiteHits.Count)"
Write-Host "Admin coupling:     $($adminHits.Count)"
Write-Host "Entity-ID review:   $($entityHits.Count)"
Write-Host ""

Write-Host "READ-ONLY AUDIT — NO FILES WERE MODIFIED." -ForegroundColor Green
Write-Host ""
Write-Host "NEXT: paste the COMPLETE output." -ForegroundColor Cyan




