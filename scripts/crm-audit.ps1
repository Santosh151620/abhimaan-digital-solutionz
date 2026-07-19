Write-Host ""
Write-Host "================================="
Write-Host " Abhimaan CRM Architecture Audit "
Write-Host "================================="
Write-Host ""

$root="src"

Write-Host "Checking duplicate wrappers..."
Get-ChildItem $root -Recurse -Include *.tsx |
Select-String "PageHeader|ModulePage|CRMTableContainer|CRMStatCard|FormCard" |
Group Path |
Sort Count -Descending

Write-Host ""
Write-Host "Finding old wrappers..."

Get-ChildItem $root -Recurse -Include *.tsx |
Select-String '<div className="space-y-|rounded-2xl|rounded-xl|shadow|border p-' |
Format-Table Path,LineNumber,Line

Write-Host ""
Write-Host "Finding duplicated headers..."

Get-ChildItem $root -Recurse -Include *.tsx |
Select-String "<h1|text-3xl|text-2xl"

Write-Host ""
Write-Host "Done."