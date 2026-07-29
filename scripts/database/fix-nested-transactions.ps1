$ErrorActionPreference = "Stop"

$migrationPath = ".\supabase\migrations"

Write-Host ""
Write-Host "============================================================"
Write-Host " ADS TRANSACTION WRAPPER CLEANUP v2"
Write-Host "============================================================"
Write-Host ""

Get-ChildItem `
    -Path $migrationPath `
    -Filter "*.sql" |
Sort-Object Name |
ForEach-Object {

    $file = $_.FullName

    $content = Get-Content `
        $file `
        -Raw

    $beginMatches = [regex]::Matches(
        $content,
        "(?im)^\s*BEGIN\s*;"
    )

    if ($beginMatches.Count -gt 1) {

        Write-Host "Fixing:" $_.Name

        Copy-Item `
            $file `
            "$file.before-v2-backup" `
            -Force

        $counter = 0

        $fixed = [regex]::Replace(
            $content,
            "(?im)^\s*BEGIN\s*;",
            {
                param($match)

                $counter++

                if ($counter -eq 1) {
                    return "BEGIN;"
                }

                return ""
            }
        )

        Set-Content `
            -Path $file `
            -Value $fixed `
            -Encoding UTF8
    }
}

Write-Host ""
Write-Host "============================================================"
Write-Host " TRANSACTION CLEANUP v2 COMPLETE"
Write-Host "============================================================"