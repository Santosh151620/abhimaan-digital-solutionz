$ErrorActionPreference = "Stop"

$file = ".\supabase\migrations\010_rls.sql"

$backup = "$file.before-function-cleanup-$(Get-Date -Format yyyyMMdd-HHmmss)"

Copy-Item $file $backup

Write-Host "Backup created:"
Write-Host $backup


$content = Get-Content $file -Raw


$functionPattern = '(?s)CREATE OR REPLACE FUNCTION apply_crm_tenant_policy\(.*?\$\;'


$matches = [regex]::Matches(
    $content,
    $functionPattern
)


Write-Host ""
Write-Host "Function blocks found:"
Write-Host $matches.Count


if($matches.Count -le 1)
{
    Write-Host "No duplicate functions detected."
    exit
}


$firstFunction = $matches[0].Value


$content = [regex]::Replace(
    $content,
    $functionPattern,
    '',
    [System.Text.RegularExpressions.RegexOptions]::Singleline
)


$firstCall = "SELECT apply_crm_tenant_policy"


$content = $content -replace `
$firstCall,
"$firstFunction`r`n`r`n$firstCall"


Set-Content `
-Path $file `
-Value $content `
-Encoding UTF8


Write-Host ""
Write-Host "Duplicate CRM function blocks removed."