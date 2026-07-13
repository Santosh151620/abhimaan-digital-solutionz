$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "===================================="
Write-Host "Sprint 1.8 - Lead Notes Audit"
Write-Host "===================================="
Write-Host ""

$files = @(
".\src\components\entities\EntityNotes.tsx",
".\src\components\entities\NotesPanel.tsx",
".\src\services\notes.service.ts",
".\src\repositories\notes.repository.ts",
".\src\app\api\leads\[id]\notes\route.ts",
".\src\app\api\entities\notes\route.ts",
".\src\modules\leads\components\LeadWorkspace.tsx"
)

foreach($file in $files)
{
    if(Test-Path $file)
    {
        Write-Host "[OK] $file"
    }
    else
    {
        Write-Host "[MISSING] $file"
    }
}

Write-Host ""
Write-Host "Searching Notes usage..."

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "EntityNotes|NotesPanel|notes.service|notes.repository|lead_notes" |
Select Path,LineNumber |
Sort Path