# ============================================================
# ADS Migration Transaction Wrapper Normalizer
# File: fix-transaction-blocks.ps1
# PowerShell 5.1 Compatible
# ============================================================

$ErrorActionPreference = "Stop"

$RootPath = Resolve-Path "$PSScriptRoot\..\.."
$MigrationPath = Join-Path $RootPath "supabase\migrations"


Write-Host ""
Write-Host "============================================================"
Write-Host " ADS TRANSACTION WRAPPER NORMALIZER"
Write-Host "============================================================"
Write-Host ""


$migrations = Get-ChildItem `
    -Path $MigrationPath `
    -Filter "*.sql" |
    Sort-Object Name


$updated = @()


foreach ($file in $migrations) {


    $content = Get-Content `
        -Path $file.FullName `
        -Raw


    # Only real SQL transaction statements
    $pattern = "(?im)^\s*(BEGIN|START\s+TRANSACTION)(\s+TRANSACTION)?\s*;"


    $matches = [regex]::Matches(
        $content,
        $pattern
    )


    if ($matches.Count -gt 1) {


        Write-Host "Normalizing:"
        Write-Host $file.Name


        $backup = "$($file.FullName).transaction-backup"


        if (!(Test-Path $backup)) {

            Copy-Item `
                $file.FullName `
                $backup

        }


        $foundFirst = $false


        $newContent = [regex]::Replace(
            $content,
            $pattern,
            {

                param($match)


                if ($foundFirst -eq $false) {

                    $foundFirst = $true

                    return "BEGIN;"

                }


                return ""

            }
        )


        Set-Content `
            -Path $file.FullName `
            -Value $newContent `
            -Encoding UTF8


        $updated += $file.Name

    }

}


Write-Host ""
Write-Host "============================================================"
Write-Host " SUMMARY"
Write-Host "============================================================"
Write-Host ""


if ($updated.Count -eq 0) {

    Write-Host "No duplicate transaction wrappers detected."

}
else {

    Write-Host "Updated:"

    foreach ($file in $updated) {

        Write-Host "[FIXED] $file"

    }

}


Write-Host ""
Write-Host "STATUS: COMPLETE"