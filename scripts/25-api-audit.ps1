$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "API Route Audit"
Write-Host "========================================="

Get-ChildItem .\src\app\api -Recurse -Filter route.ts |
ForEach-Object{
    Write-Host ""
    Write-Host $_.FullName
    Select-String -Path $_.FullName -Pattern "NextResponse","try","catch","return"
}

Write-Host ""
Write-Host "Audit Complete."