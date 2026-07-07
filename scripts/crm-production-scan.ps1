$root = "C:\Projects\MDSWEBSITE\abhimaan-digital-solutionz"

$patterns = @(
    "TODO",
    "FIXME",
    "placeholder",
    "coming soon",
    "return null",
    "return []",
    "=> []",
    "mock",
    "dummy"
)

Write-Host "=== CRM Production Readiness Scan ==="

Get-ChildItem -Path "$root\src" -Recurse -File |
Where-Object {
    $_.Extension -in @(".ts",".tsx",".js",".jsx")
} |
Select-String -Pattern $patterns -SimpleMatch |
Select-Object Path, LineNumber, Line |
Format-Table -AutoSize

Write-Host ""
Write-Host "=== Scan Complete ==="