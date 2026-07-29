# ============================================================
# ADS Enterprise Migration Audit v2
# PostgreSQL Aware Validator
# PowerShell 5.1 Compatible
# ============================================================

$ErrorActionPreference = "Stop"

$RootPath = Resolve-Path "$PSScriptRoot\..\.."
$MigrationPath = Join-Path $RootPath "supabase\migrations"

$ReportPath = Join-Path $RootPath "Migration-QA-Report"


Write-Host ""
Write-Host "============================================================"
Write-Host " ADS DATABASE MIGRATION AUDIT v2"
Write-Host "============================================================"
Write-Host ""


if (!(Test-Path $MigrationPath)) {

    Write-Host "Migration folder missing:"
    Write-Host $MigrationPath
    exit 1

}


$migrations = Get-ChildItem `
    -Path $MigrationPath `
    -Filter "*.sql" |
    Sort-Object Name


$results = @()


$expected = 1..40

$actual = @()


foreach ($file in $migrations) {

    if ($file.Name -match "^(\d{3})_") {

        $actual += [int]$Matches[1]

    }

}


foreach ($file in $migrations) {


    $content = Get-Content `
        -Path $file.FullName `
        -Raw


    $issues = @()
    $warnings = @()


    #
    # Empty file
    #
    if ([string]::IsNullOrWhiteSpace($content)) {

        $issues += "Empty migration file"

    }


    #
    # Real transaction detection
    # Only BEGIN; outside dollar blocks
    #

    $cleanSql = [regex]::Replace(
        $content,
        "(?s)\$\$.*?\$\$",
        ""
    )


    $transactionCount =
        ([regex]::Matches(
            $cleanSql,
            "(?im)^\s*(BEGIN|START TRANSACTION)\s*;"
        )).Count


    if ($transactionCount -gt 1) {

        $issues += "Multiple migration transaction wrappers"

    }


    #
    # Commit check
    #

    if ($transactionCount -eq 1) {

        if (
            $cleanSql -notmatch "(?im)^\s*COMMIT\s*;"
        ) {

            $warnings += "Transaction without COMMIT"

        }

    }


    #
    # Dangerous operations
    #

    if (
        $content -match "(?i)DROP\s+(TABLE|SCHEMA)"
    ) {

        $issues += "Dangerous DROP detected"

    }


    #
    # Insert safety
    #

    if (
        $content -match "(?i)INSERT\s+INTO" -and
        $content -notmatch "(?i)ON\s+CONFLICT"
    ) {

        $warnings += "INSERT without ON CONFLICT"

    }


    #
    # Updated timestamp
    #

    if (
        $content -match "updated_at" -and
        $content -notmatch "trigger"
    ) {

        $warnings += "updated_at without trigger"

    }


    #
    # Schema
    #

    if (
        $content -match "CREATE TABLE" -and
        $content -notmatch "CREATE SCHEMA"
    ) {

        $warnings += "CREATE TABLE without schema guard"

    }


    #
    # Result
    #

    $results += [PSCustomObject]@{

        File = $file.Name

        Status =
        if ($issues.Count -gt 0) {
            "FAILED"
        }
        elseif ($warnings.Count -gt 0) {
            "WARNING"
        }
        else {
            "PASS"
        }

        Issues = ($issues -join "; ")

        Warnings = ($warnings -join "; ")

    }


    Write-Host "Checked:" $file.Name

}



#
# Migration numbering
#

$missing = $expected | Where-Object {
    $actual -notcontains $_
}


if ($missing.Count -gt 0) {

    Write-Host ""
    Write-Host "Missing migrations:"
    $missing

}



#
# Reports
#

$csv = "$ReportPath.csv"
$json = "$ReportPath.json"
$md = "$ReportPath.md"


$results | Export-Csv `
    -Path $csv `
    -NoTypeInformation


$results |
    ConvertTo-Json -Depth 5 |
    Set-Content `
    $json


$markdown = @"

# ADS Migration QA Report

Generated:
$(Get-Date)

Total migrations:
$($migrations.Count)


| Migration | Status | Issues | Warnings |
|---|---|---|---|

"@


foreach ($item in $results) {

    $markdown +=
"| $($item.File) | $($item.Status) | $($item.Issues) | $($item.Warnings) |`n"

}


Set-Content `
    -Path $md `
    -Value $markdown



#
# Summary
#

Write-Host ""
Write-Host "============================================================"
Write-Host " SUMMARY"
Write-Host "============================================================"


$results |
Group-Object Status |
ForEach-Object {

    Write-Host "$($_.Name): $($_.Count)"

}


Write-Host ""
Write-Host "Reports created:"
Write-Host $csv
Write-Host $json
Write-Host $md


if (
    ($results | Where-Object {$_.Status -eq "FAILED"}).Count -gt 0
) {

    Write-Host ""
    Write-Host "STATUS: REVIEW REQUIRED"
    exit 1

}


Write-Host ""
Write-Host "STATUS: AUDIT PASSED"
exit 0