$root = Get-Location

$paths = @(
"src\app\[locale]\dashboard",
"src\components\dashboard",
"src\modules\dashboard"
)

foreach ($path in $paths) {

    Write-Host ""
    Write-Host "=============================="
    Write-Host $path
    Write-Host "=============================="

    Get-ChildItem "$root\$path" -Recurse -File -Include *.tsx,*.ts |
    ForEach-Object {

        Write-Host ""
        Write-Host "---- FILE ----"
        Write-Host $_.FullName

        Get-Content $_.FullName
    }
}

Write-Host ""
Write-Host "=== Dashboard Scan Complete ==="
