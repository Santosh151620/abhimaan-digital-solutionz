cd C:\Projects\MDSWEBSITE\abhimaan-digital-solutionz

Write-Host "=== Dashboard Components ==="

Get-ChildItem `
".\src\modules\dashboard\components" `
-Filter "*.tsx" |
Select-Object Name

Write-Host ""

Write-Host "=== Dashboard Services ==="

Get-ChildItem `
".\src\services" `
-Filter "*dashboard*" |
Select-Object Name

Write-Host ""

Write-Host "=== TODO / TEMP FLAGS ==="

Get-ChildItem ".\src" -Recurse -Include "*.ts","*.tsx" |
Select-String "TODO|TEMP|LEGACY" |
Select-Object Path,LineNumber,Line