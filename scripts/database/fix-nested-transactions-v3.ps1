$ErrorActionPreference = "Stop"

$migrationPath = ".\supabase\migrations"

Write-Host ""
Write-Host "============================================================"
Write-Host " ADS TRANSACTION CLEANUP v3"
Write-Host "============================================================"
Write-Host ""

Get-ChildItem `
    -Path $migrationPath `
    -Filter "*.sql" |
Sort-Object Name |
ForEach-Object {

    $file = $_.FullName

    $lines = Get-Content $file

    $beginFound = $false
    $changed = $false

    $output = foreach ($line in $lines) {

        if ($line.Trim() -eq "BEGIN;") {

            if ($beginFound) {

                $changed = $true
                continue
            }

            $beginFound = $true
        }

        $line
    }

    if ($changed) {

        Write-Host "Fixing:" $_.Name

        Copy-Item `
            $file `
            "$file.before-v3-backup" `
            -Force

        $output |
        Set-Content `
            -Path $file `
            -Encoding UTF8
    }
}

Write-Host ""
Write-Host "============================================================"
Write-Host " TRANSACTION CLEANUP v3 COMPLETE"
Write-Host "============================================================"