# ============================================================
# ADS Migration Intelligence Summary
# PowerShell 5.1 Compatible
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================"
Write-Host " ADS MIGRATION INTELLIGENCE SUMMARY"
Write-Host "============================================"
Write-Host ""


$reportPath = ".\reports\migration"

if (!(Test-Path $reportPath)) {
    New-Item -ItemType Directory -Path $reportPath | Out-Null
}


$output = Join-Path $reportPath "migration-summary.md"


"# ADS Migration Intelligence Summary" | Out-File $output

"`nGenerated: $(Get-Date)" | Out-File $output -Append


function Scan-Files {

    param(
        [string]$Title,
        [string]$Path,
        [string]$Pattern,
        [string]$Priority
    )


    "`n## $Title" | Out-File $output -Append
    "" | Out-File $output -Append
    "Priority: $Priority" | Out-File $output -Append
    "" | Out-File $output -Append


    if (!(Test-Path $Path)) {
        "Path not found: $Path" | Out-File $output -Append
        return
    }


    $files = Get-ChildItem `
        -Path $Path `
        -Recurse `
        -File `
        -Include *.ts,*.tsx `
        -ErrorAction SilentlyContinue


    $found = $false


    foreach ($file in $files) {

        $matches = Select-String `
            -Path $file.FullName `
            -Pattern $Pattern `
            -ErrorAction SilentlyContinue


        if ($matches) {

            $found = $true

            "- $($file.FullName.Replace((Get-Location).Path,''))" |
            Out-File $output -Append

            "  Matches: $($matches.Count)" |
            Out-File $output -Append
        }
    }


    if (!$found) {
        "- No matches" | Out-File $output -Append
    }

}



Scan-Files `
"Shared Engine Entity Migration" `
".\src\repositories" `
"leadId|clientId|projectId" `
"HIGH"



Scan-Files `
"CRM Types Migration" `
".\src\types" `
"leadId|clientId|projectId" `
"MEDIUM"



Scan-Files `
"Services Migration" `
".\src\services" `
"createClient|supabase.from" `
"HIGH"



Scan-Files `
"Module Review" `
".\src\modules" `
"leadId|clientId|projectId" `
"LOW"



"`n============================================" |
Out-File $output -Append

"END OF REPORT" |
Out-File $output -Append



Write-Host ""
Write-Host "MIGRATION SUMMARY COMPLETE"
Write-Host ""
Write-Host "REPORT:"
Write-Host $output
Write-Host ""