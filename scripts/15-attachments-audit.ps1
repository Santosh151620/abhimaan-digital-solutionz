$ErrorActionPreference="Stop"

Write-Host ""
Write-Host "======================================"
Write-Host "Sprint 6 - Attachments Audit"
Write-Host "======================================"

$files=@(
".\src\components\entities\EntityAttachments.tsx",
".\src\components\entities\AttachmentPanel.tsx",
".\src\repositories\attachments.repository.ts",
".\src\services\attachments.service.ts",
".\src\app\api\entities\attachments\route.ts"
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
Write-Host "Searching attachment usage..."

Get-ChildItem .\src -Recurse -Include *.ts,*.tsx |
Select-String "EntityAttachments|AttachmentPanel|attachments.service|attachments.repository|upload|download|preview" |
Select Path,LineNumber |
Sort Path