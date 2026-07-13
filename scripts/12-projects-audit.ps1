$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "=================================="
Write-Host "Sprint 3 - Projects Audit"
Write-Host "=================================="

$paths=@(
".\src\modules\projects",
".\src\modules\projects\repositories\project.repository.ts",
".\src\modules\projects\services\projects.ts",
".\src\modules\projects\hooks\useProjects.ts",
".\src\modules\projects\components\ProjectTable.tsx",
".\src\modules\projects\components\ProjectForm.tsx",
".\src\modules\projects\components\ProjectModal.tsx"
)

foreach($p in $paths){
    if(Test-Path $p){
        Write-Host "[OK] $p"
    }else{
        Write-Host "[MISSING] $p"
    }
}

Write-Host ""
Write-Host "Searching project usage..."

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "useProjects|ProjectTable|ProjectModal|project.repository|project_timeline" |
Select Path,LineNumber |
Sort Path