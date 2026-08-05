$ErrorActionPreference = "Stop"

$file = ".\supabase\migrations\010_rls.sql"

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

$backup = ".\supabase\migrations\010_rls.sql.marker-cleanup-backup-$timestamp"

Copy-Item $file $backup -Force

Write-Host "Backup created:"
Write-Host $backup


$content = Get-Content $file -Raw


$removeMarkers = @(
    "-- EXTENDED CRM CHILD TABLE TENANT SECURITY",
    "-- COMPLETE CRM CHILD TABLE TENANT SECURITY PATCH",
    "-- REMAINING CRM CHILD TABLE TENANT SECURITY PATCH"
)


foreach($marker in $removeMarkers)
{
    $content = $content.Replace($marker,"")
}


$content = $content -replace "\r?\n\r?\n\r?\n+", "`r`n`r`n"


Set-Content `
    -Path $file `
    -Value $content `
    -Encoding UTF8


Write-Host ""
Write-Host "RLS section markers cleaned successfully."