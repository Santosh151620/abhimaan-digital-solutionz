$ErrorActionPreference = "Stop"

$file = ".\supabase\migrations\010_rls.sql"

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

$backup = "$file.cleanup-backup-$timestamp"

Copy-Item $file $backup

Write-Host "Backup created:"
Write-Host $backup


$content = Get-Content $file -Raw


$marker = "-- EXTENDED CRM CHILD TABLE TENANT SECURITY"


$first = $content.IndexOf($marker)


if ($first -lt 0)
{
    throw "Marker not found"
}


$before = $content.Substring(0,$first)


$after = $content.Substring($first)


$second = $after.IndexOf($marker, $marker.Length)


if ($second -gt 0)
{
    $after = $after.Substring(0,$second)
}


$newContent = $before + $after


Set-Content `
-Path $file `
-Value $newContent `
-Encoding UTF8


Write-Host ""
Write-Host "Duplicate CRM child RLS sections removed."