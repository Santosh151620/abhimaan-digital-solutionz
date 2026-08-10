$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================================"
Write-Host " ADS DUPLICATE RESOLUTION AUDIT"
Write-Host "============================================================"
Write-Host ""

$root = (Get-Location).Path
$src  = Join-Path $root "src"

$targets = @(
    "src\repositories\index.ts",
    "src\repositories\admin\index.ts",
    "src\repositories\crm\index.ts",

    "src\repositories\admin\NotificationsRepository.ts",
    "src\repositories\crm\NotificationsRepository.ts",

    "src\repositories\admin\SettingsRepository.ts",
    "src\repositories\crm\SettingsRepository.ts",

    "src\services\index.ts",
    "src\services\admin\index.ts",
    "src\services\crm\index.ts",

    "src\services\admin\NotificationsService.ts",
    "src\services\crm\NotificationsService.ts",

    "src\services\admin\SettingsService.ts",
    "src\services\crm\SettingsService.ts",

    "src\types\activity.ts",
    "src\types\crm\Activity.ts",

    "src\types\attachments.ts",
    "src\types\crm\Attachments.ts",

    "src\types\notes.ts",
    "src\types\crm\Notes.ts",

    "src\types\notifications.ts",
    "src\types\crm\Notifications.ts",

    "src\types\tasks.ts",
    "src\types\crm\Tasks.ts",

    "src\types\workflow.ts",
    "src\types\admin\Workflow.ts",
    "src\types\workflow\Workflow.ts",

    "src\types\admin\Audit.ts",
    "src\types\platform\Audit.ts",

    "src\types\admin\Notification.ts",
    "src\types\crm\Notification.ts",

    "src\types\admin\Permission.ts",
    "src\types\crm\Permission.ts",

    "src\types\admin\Role.ts",
    "src\types\auth\role.ts",

    "src\types\admin\Settings.ts",
    "src\types\crm\Settings.ts",

    "src\modules\leads\contracts\lead.contract.ts"
)

$allFiles = Get-ChildItem $src -Recurse -File |
    Where-Object {
        $_.Extension -in @(".ts",".tsx") -and
        $_.FullName -notmatch "\\node_modules\\"
    }

Write-Host "SOURCE FILES: $($allFiles.Count)"
Write-Host ""

foreach ($relative in $targets) {

    $full = Join-Path $root $relative

    if (-not (Test-Path $full)) {
        Write-Host "MISSING: $relative"
        continue
    }

    Write-Host ""
    Write-Host "------------------------------------------------------------"
    Write-Host $relative
    Write-Host "------------------------------------------------------------"

    $content = [System.IO.File]::ReadAllText($full)

    $imports = @()

    foreach ($file in $allFiles) {
        if ($file.FullName -eq $full) {
            continue
        }

        $other = [System.IO.File]::ReadAllText($file.FullName)

        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($full)
        $normalizedTarget = $relative.Replace("\","/").Replace(".ts","").Replace(".tsx","")

        $patterns = @(
            [regex]::Escape($normalizedTarget),
            [regex]::Escape($baseName)
        )

        $matched = $false

        foreach ($pattern in $patterns) {
            if ($other -match "(?m)(from\s+['""][^'""]*$pattern[^'""]*['""]|import\s*\(\s*['""][^'""]*$pattern[^'""]*['""]\s*\))") {
                $matched = $true
                break
            }
        }

        if ($matched) {
            $imports += $file.FullName.Substring($root.Length + 1)
        }
    }

    if ($imports.Count -eq 0) {
        Write-Host "REFERENCED BY: NONE"
    }
    else {
        Write-Host "REFERENCED BY:"
        $imports | Sort-Object | ForEach-Object {
            Write-Host "  $_"
        }
    }

    Write-Host ""
    Write-Host "EXPORTS:"

    $content -split "`r?`n" |
        Where-Object {
            $_ -match "^\s*(export|export\s+default)"
        } |
        Select-Object -First 80 |
        ForEach-Object {
            Write-Host "  $($_.Trim())"
        }
}

Write-Host ""
Write-Host "------------------------------------------------------------"
Write-Host "LEGACY LEAD CONTRACT REFERENCE"
Write-Host "------------------------------------------------------------"

$leadContract = Join-Path $root "src\modules\leads\contracts\lead.contract.ts"

if (Test-Path $leadContract) {
    $content = [System.IO.File]::ReadAllText($leadContract)

    $content -split "`r?`n" |
        Where-Object {
            $_ -match "LeadRepository|repository|import"
        } |
        ForEach-Object {
            Write-Host $_
        }
}
else {
    Write-Host "Lead contract not found."
}

Write-Host ""
Write-Host "============================================================"
Write-Host " AUDIT COMPLETE"
Write-Host "============================================================"
Write-Host ""
Write-Host "READ-ONLY — NO FILES MODIFIED."
