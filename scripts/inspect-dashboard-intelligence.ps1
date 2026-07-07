cd C:\Projects\MDSWEBSITE\MDSWEBSITE\abhimaan-digital-solutionz

Write-Host "=== Dashboard Service ==="
Get-Content -LiteralPath ".\src\services\dashboard.ts"

Write-Host ""
Write-Host "=== Intelligence Cards ==="

Get-ChildItem ".\src\modules\dashboard\components" `
-Filter "*Card.tsx" |
ForEach-Object {
    Write-Host ""
    Write-Host "----- $($_.Name) -----"
    Get-Content -LiteralPath $_.FullName
}

Write-Host ""
Write-Host "=== Git ==="
git status --short