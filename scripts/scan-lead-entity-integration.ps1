$root = "C:\Projects\MDSWEBSITE\abhimaan-digital-solutionz"

$targets = @(
    "src\modules\leads",
    "src\components",
    "src\hooks",
    "src\services"
)

$patterns = @(
    "LeadWorkspace",
    "Activity",
    "Notes",
    "Tasks",
    "Attachments",
    "entity"
)

Write-Host "=== Lead Entity Integration Scan ==="

foreach ($target in $targets) {
    $path = Join-Path $root $target

    if (Test-Path $path) {
        Write-Host ""
        Write-Host "## $target"

        Get-ChildItem -Path $path -Recurse -File |
        Where-Object {
            $_.Extension -in @(".ts",".tsx",".js",".jsx")
        } |
        Select-String -Pattern $patterns -SimpleMatch |
        Select-Object Path, LineNumber, Line |
        Format-Table -AutoSize
    }
}

Write-Host ""
Write-Host "=== Scan Complete ==="
