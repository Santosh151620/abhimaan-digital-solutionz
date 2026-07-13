$ErrorActionPreference = "Stop"

$root = Resolve-Path "$PSScriptRoot\..\.."

Write-Host ""
Write-Host "=== Fixing Next.js Dynamic Route Names ==="
Write-Host ""

$entityDir = Join-Path $root "src\app\api\leads\[entityId]"
$idDir = Join-Path $root "src\app\api\leads\[id]"

if (!(Test-Path -LiteralPath $entityDir)) {
    Write-Host "[OK] Nothing to fix."
    exit 0
}

$routeFile = Join-Path $entityDir "route.ts"

if (!(Test-Path -LiteralPath $routeFile)) {
    Write-Host "[ERROR] route.ts not found."
    exit 1
}

# Create [id] folder if missing
if (!(Test-Path -LiteralPath $idDir)) {
    New-Item -ItemType Directory -Path $idDir | Out-Null
}

$destination = Join-Path $idDir "route.ts"

if (Test-Path -LiteralPath $destination) {
    Write-Host ""
    Write-Host "[ERROR] src\app\api\leads\[id]\route.ts already exists."
    Write-Host "Nothing changed."
    exit 1
}

Move-Item -LiteralPath $routeFile -Destination $destination

Remove-Item -LiteralPath $entityDir -Recurse -Force

(Get-Content $destination -Raw) `
    -replace 'entityId','id' `
| Set-Content $destination

Write-Host ""
Write-Host "[SUCCESS]"
Write-Host "Moved:"
Write-Host "  [entityId]\route.ts"
Write-Host "      ->"
Write-Host "  [id]\route.ts"
Write-Host ""
Write-Host "Deleted:"
Write-Host "  [entityId]"
Write-Host ""