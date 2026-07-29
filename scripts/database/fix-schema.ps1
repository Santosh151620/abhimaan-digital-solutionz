# ============================================================
# ADS Migration Schema Alignment Fixer
# File: fix-schema.ps1
# PowerShell: 5.1 Compatible
# ============================================================

$ErrorActionPreference = "Stop"

$RootPath = Resolve-Path "$PSScriptRoot\..\.."
$MigrationPath = Join-Path $RootPath "supabase\migrations"

Write-Host ""
Write-Host "============================================================"
Write-Host " ADS MIGRATION SCHEMA ALIGNMENT"
Write-Host "============================================================"
Write-Host ""

$migrations = Get-ChildItem `
    -Path $MigrationPath `
    -Filter "*.sql" `
    | Sort-Object Name


$modified = @()


foreach ($file in $migrations) {

    $content = Get-Content `
        -Path $file.FullName `
        -Raw


    if (
        $content -match "CREATE TABLE" -and
        $content -notmatch "CREATE SCHEMA"
    ) {


        Write-Host "Schema declaration missing:"
        Write-Host $file.Name


        $backup = "$($file.FullName).backup"


        if (!(Test-Path $backup)) {

            Copy-Item `
                -Path $file.FullName `
                -Destination $backup

        }


        $schemaBlock = @"
-- ============================================================
-- ADS Schema Safety Block
-- Added automatically by fix-schema.ps1
-- ============================================================

CREATE SCHEMA IF NOT EXISTS public;

"@


        $updatedContent = `
            $schemaBlock + $content


        Set-Content `
            -Path $file.FullName `
            -Value $updatedContent `
            -Encoding UTF8


        $modified += $file.Name

    }

}


Write-Host ""
Write-Host "============================================================"
Write-Host " SUMMARY"
Write-Host "============================================================"
Write-Host ""


if ($modified.Count -eq 0) {

    Write-Host "No schema fixes required."

}
else {

    Write-Host "Modified migrations:"

    foreach ($item in $modified) {

        Write-Host "[UPDATED] $item"

    }

}


Write-Host ""
Write-Host "STATUS: SCHEMA ALIGNMENT COMPLETE"