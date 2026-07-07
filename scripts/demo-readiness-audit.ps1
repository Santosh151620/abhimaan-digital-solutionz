cd C:\Projects\MDSWEBSITE\abhimaan-digital-solutionz

Write-Host ""
Write-Host "======================================="
Write-Host "        DEMO READINESS AUDIT"
Write-Host "======================================="
Write-Host ""

$modules = @(
    "dashboard",
    "leads",
    "projects",
    "payments",
    "email",
    "tasks"
)

foreach ($m in $modules) {

    Write-Host ""
    Write-Host "===== $m ====="

    $dirs = Get-ChildItem ".\src\app" -Directory -Recurse | Where-Object {
        $_.FullName -match "\\$m($|\\)"
    }

    foreach ($dir in $dirs) {

        Write-Host $dir.FullName

        $files = @(
            "page.tsx",
            "loading.tsx",
            "error.tsx",
            "not-found.tsx"
        )

        foreach ($f in $files) {

            $target = Join-Path $dir.FullName $f

            if (Test-Path $target) {
                Write-Host ("   [OK] " + $f)
            }
            else {
                Write-Host ("   [--] " + $f)
            }

        }

    }

}

Write-Host ""
Write-Host "======================================="
Write-Host "API ROUTES"
Write-Host "======================================="

if (Test-Path ".\src\app\api") {
    Get-ChildItem ".\src\app\api" -Directory -Recurse |
        Select-Object FullName
}
else {
    Write-Host "No API folder found."
}

Write-Host ""
Write-Host "======================================="
Write-Host "GIT STATUS"
Write-Host "======================================="

git status --short

Write-Host ""
Write-Host "Audit Complete."