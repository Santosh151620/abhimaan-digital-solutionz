Write-Host "======================================="
Write-Host " CRM ARCHITECTURE STANDARDIZATION AUDIT "
Write-Host "======================================="


Write-Host ""
Write-Host "=== Duplicate Service Files ==="

Get-ChildItem src\services\crm -File |
Group-Object {
    $_.BaseName -replace "s$",""
} |
Where-Object {
    $_.Count -gt 1
} |
Select-Object Name, Count, Group


Write-Host ""
Write-Host "=== Duplicate Repository Files ==="

Get-ChildItem src\repositories\crm -File |
Group-Object {
    $_.BaseName -replace "s$",""
} |
Where-Object {
    $_.Count -gt 1
} |
Select-Object Name, Count, Group



Write-Host ""
Write-Host "=== Singular Imports ==="

Select-String `
-Path src\**\*.ts* `
-Pattern "@/services/crm/[A-Z][a-z]+Service" |
Select-Object Path,LineNumber,Line



Write-Host ""
Write-Host "=== Legacy Repository Imports ==="

Select-String `
-Path src\**\*.ts* `
-Pattern "@/repositories/crm/[A-Z][a-z]+Repository" |
Select-Object Path,LineNumber,Line



Write-Host ""
Write-Host "=== CRM Index Exports ==="

Get-Content `
src\services\crm\index.ts


Get-Content `
src\repositories\crm\index.ts



Write-Host ""
Write-Host "=== TYPESCRIPT CHECK ==="

npx tsc --noEmit


Write-Host ""
Write-Host "=== LINT CHECK ==="

npm run lint