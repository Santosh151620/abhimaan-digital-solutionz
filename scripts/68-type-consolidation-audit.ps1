Write-Host ""
Write-Host "========================================="
Write-Host " Phase 3.8 - Type Consolidation Audit"
Write-Host "========================================="
Write-Host ""

$root = Resolve-Path "$PSScriptRoot\.."

Write-Host "Type Definition Files"
Write-Host "---------------------"

Get-ChildItem "$root\src" -Recurse -Include *.ts |
Where-Object {
    $_.DirectoryName -match "\\types($|\\)"
} |
Sort-Object Name |
Select FullName

Write-Host ""

Write-Host "Interfaces"
Write-Host "----------"

Get-ChildItem "$root\src" -Recurse -Include *.ts |
Select-String "export interface " |
Select Path,LineNumber,Line

Write-Host ""

Write-Host "Type Aliases"
Write-Host "------------"

Get-ChildItem "$root\src" -Recurse -Include *.ts |
Select-String "export type " |
Select Path,LineNumber,Line

Write-Host ""

Write-Host "Enums"
Write-Host "-----"

Get-ChildItem "$root\src" -Recurse -Include *.ts |
Select-String "export enum " |
Select Path,LineNumber,Line

Write-Host ""

Write-Host "Duplicate Type Names"
Write-Host "--------------------"

$types = Get-ChildItem "$root\src" -Recurse -Include *.ts |
Select-String "export (interface|type|enum) "

$types |
ForEach-Object{

    if($_.Line -match "export (interface|type|enum)\s+([A-Za-z0-9_]+)"){
        [PSCustomObject]@{
            Name = $Matches[2]
            Path = $_.Path
        }
    }

} |
Group-Object Name |
Where-Object {$_.Count -gt 1} |
Sort Count -Descending |
Format-Table Count,Name -Auto

Write-Host ""

Write-Host "Imports From /types"
Write-Host "-------------------"

Get-ChildItem "$root\src" -Recurse -Include *.ts,*.tsx |
Select-String "@/types|from ['""]\.\.?/.*/types" |
Select Path,LineNumber

Write-Host ""

Write-Host "Running Lint..."
npm run lint
if($LASTEXITCODE -ne 0){ throw "Lint Failed" }

Write-Host ""

Write-Host "Running Build..."
npm run build
if($LASTEXITCODE -ne 0){ throw "Build Failed" }

Write-Host ""
Write-Host "Type Consolidation Audit Completed Successfully."