cd C:\Projects\MDSWEBSITE\abhimaan-digital-solutionz

Write-Host "=== Dashboard Page ==="
Get-ChildItem ".\src\app\[locale]\dashboard" -File -Recurse | Select-Object FullName

Write-Host ""
Write-Host "=== Dashboard Components ==="
Get-ChildItem ".\src\modules\dashboard\components" -File | Select-Object Name

Write-Host ""
Write-Host "=== Dashboard Services ==="
Get-ChildItem ".\src\services" -Filter "*dashboard*" | Select-Object Name

Write-Host ""
Write-Host "=== Dashboard Page Imports ==="
Select-String `
-Path ".\src\app\[locale]\dashboard\page.tsx" `
-Pattern "dashboard|Panel|Card|Snapshot|Analytics|Executive|Pipeline|Revenue|Copilot" `
-CaseSensitive:$false

Write-Host ""
Write-Host "=== Git Status ==="
git status --short