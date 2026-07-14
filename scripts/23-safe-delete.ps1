$ErrorActionPreference="Stop"

$files=@(
".\src\modules\leads\components\LeadModal.tsx.backup",
".\src\modules\leads\components\LeadTable.tsx.backup"
)

foreach($file in $files)
{
    if(Test-Path $file)
    {
        Remove-Item $file -Force
        Write-Host "[DELETED] $file"
    }
}