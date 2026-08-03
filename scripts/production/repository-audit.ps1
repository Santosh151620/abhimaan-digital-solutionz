# ============================================================
# ADS Repository Migration Audit
# PowerShell 5.1 Compatible
# Bulletproof Version
# ============================================================

$ErrorActionPreference = "Stop"


Write-Host ""
Write-Host "============================================"
Write-Host " ADS REPOSITORY MIGRATION AUDIT"
Write-Host "============================================"
Write-Host ""


$reportRoot = ".\reports\repository-audit"


if (!(Test-Path -Path $reportRoot)) {

    New-Item -ItemType Directory -Path $reportRoot | Out-Null

}


$output = Join-Path `
    $reportRoot `
    ("audit-" + (Get-Date -Format "yyyyMMdd-HHmmss") + ".txt")



function Add-Line {

    param(
        [string]$Text
    )

    Add-Content -Path $output -Value $Text

}



function Scan-Pattern {

    param(
        [string]$Title,
        [string]$ScanPath,
        [string]$Pattern
    )


    Add-Line ""
    Add-Line "============================================"
    Add-Line $Title
    Add-Line "Path: $ScanPath"
    Add-Line "Pattern: $Pattern"
    Add-Line "============================================"


    if([string]::IsNullOrEmpty($ScanPath)) {

        Add-Line "EMPTY PATH RECEIVED"
        return

    }


    if(!(Test-Path -Path $ScanPath)) {

        Add-Line "PATH NOT FOUND"
        return

    }


    $files = Get-ChildItem `
        -Path $ScanPath `
        -Recurse `
        -File `
        -Include *.ts,*.tsx,*.js,*.jsx `
        -ErrorAction SilentlyContinue



    $total = 0


    foreach($file in $files) {


        $matches = Select-String `
            -Path $file.FullName `
            -Pattern $Pattern `
            -ErrorAction SilentlyContinue


        foreach($match in $matches) {


            $total++


            Add-Line (
                $match.Path +
                " | Line " +
                $match.LineNumber +
                " | " +
                $match.Line.Trim()
            )


        }


    }



    if($total -eq 0) {

        Add-Line "NONE FOUND"

    }
    else {

        Add-Line ""
        Add-Line ("TOTAL MATCHES: " + $total)

    }


}




# ============================================================
# EXECUTE AUDITS
# ============================================================


Scan-Pattern `
    -Title "LEGACY REPOSITORIES" `
    -ScanPath ".\src\repositories" `
    -Pattern "Legacy|Old|Deprecated"



Scan-Pattern `
    -Title "REPOSITORY REFERENCES" `
    -ScanPath ".\src" `
    -Pattern "Repository"



Scan-Pattern `
    -Title "LEGACY SERVICES" `
    -ScanPath ".\src\services" `
    -Pattern "legacy|old|deprecated"



Scan-Pattern `
    -Title "SERVICE IMPORT REFERENCES" `
    -ScanPath ".\src" `
    -Pattern "@/services|services/"



Scan-Pattern `
    -Title "LEGACY TYPES" `
    -ScanPath ".\src\types" `
    -Pattern "Legacy|Old|Deprecated"



Scan-Pattern `
    -Title "TYPE IMPORT REFERENCES" `
    -ScanPath ".\src" `
    -Pattern "@/types|types/"



Scan-Pattern `
    -Title "DIRECT SUPABASE ACCESS" `
    -ScanPath ".\src" `
    -Pattern "createClient|supabase.from"



Scan-Pattern `
    -Title "TENANT CONTEXT REFERENCES" `
    -ScanPath ".\src" `
    -Pattern "TenantContextManager"



Scan-Pattern `
    -Title "ENTITY ID VIOLATIONS" `
    -ScanPath ".\src" `
    -Pattern "leadId|clientId|projectId"



Add-Line ""
Add-Line "============================================"
Add-Line "AUDIT COMPLETED"
Add-Line ("Generated: " + (Get-Date))
Add-Line "============================================"



Write-Host ""
Write-Host "AUDIT COMPLETE"
Write-Host ""
Write-Host "REPORT:"
Write-Host $output
Write-Host ""