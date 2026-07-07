$root = "C:\Projects\MDSWEBSITE\abhimaan-digital-solutionz"

Write-Host "=== Final Runtime Scan ==="

$patterns = @(
    "console.log",
    "console.error",
    "debugger",
    "as any",
    "TODO",
    "FIXME"
)

Get-ChildItem "$root\src" -Recurse -File |
Where-Object {
    $_.Extension -in @(".ts",".tsx",".js",".jsx")
} |
Select-String -Pattern $patterns -SimpleMatch |
Select-Object Path,LineNumber,Line |
Format-Table -AutoSize

Write-Host ""
Write-Host "=== Scan Complete ==="
