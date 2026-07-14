Write-Host ""
Write-Host "========================================="
Write-Host " Phase 3.9 - Hook Consolidation Audit"
Write-Host "========================================="
Write-Host ""

$root = Resolve-Path "$PSScriptRoot\.."

Write-Host "React Hook Files"
Write-Host "----------------"

Get-ChildItem "$root\src" -Recurse -Include use*.ts,use*.tsx |
Sort-Object Name |
Select-Object FullName

Write-Host ""

Write-Host "Custom Hook Exports"
Write-Host "-------------------"

Get-ChildItem "$root\src" -Recurse -Include *.ts,*.tsx |
Select-String "export function use|export const use" |
Select Path,LineNumber,Line

Write-Host ""

Write-Host "Duplicate Hook Names"
Write-Host "--------------------"

$hooks = Get-ChildItem "$root\src" -Recurse -Include use*.ts,use*.tsx

$hooks |
Group-Object Name |
Where-Object {$_.Count -gt 1} |
Sort Count -Descending |
Format-Table Count,Name -Auto

Write-Host ""

Write-Host "Hook Imports"
Write-Host "------------"

Get-ChildItem "$root\src" -Recurse -Include *.ts,*.tsx |
Select-String "from .*use[A-Za-z]" |
Select Path,LineNumber

Write-Host ""

Write-Host "Unused Hook Files"
Write-Host "-----------------"

foreach($hook in $hooks){

    $name = [System.IO.Path]::GetFileNameWithoutExtension($hook.Name)

    $refs = Get-ChildItem "$root\src" -Recurse -Include *.ts,*.tsx |
        Where-Object {$_.FullName -ne $hook.FullName} |
        Select-String "\b$name\b"

    if(-not $refs){
        Write-Host "[UNUSED] $($hook.FullName)"
    }
}

Write-Host ""

Write-Host "Running Lint..."
npm run lint
if($LASTEXITCODE -ne 0){ throw "Lint Failed" }

Write-Host ""

Write-Host "Running Build..."
npm run build
if($LASTEXITCODE -ne 0){ throw "Build Failed" }

Write-Host ""

Write-Host "Hook Consolidation Audit Completed."