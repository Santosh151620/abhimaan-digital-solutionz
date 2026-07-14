$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "========================================="
Write-Host "Logger Audit"
Write-Host "========================================="

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "logger|audit|console.log|console.error|console.warn" |
Select Path,LineNumber,Line |
Sort Path

Write-Host ""
Write-Host "Audit Complete."