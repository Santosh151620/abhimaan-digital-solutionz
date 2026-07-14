Write-Host ""
Write-Host "======================================="
Write-Host " Phase 3.3 - Remove Backup Files"
Write-Host "======================================="
Write-Host ""

$root = Resolve-Path "$PSScriptRoot\.."

$files = @(
"$root\src\modules\leads\components\LeadModal.tsx.backup",
"$root\src\modules\leads\components\LeadTable.tsx.backup"
)

foreach($file in $files){

    if(Test-Path $file){

        Remove-Item $file -Force
        Write-Host "[REMOVED] $file"

    }else{

        Write-Host "[NOT FOUND] $file"

    }

}

Write-Host ""
Write-Host "Searching remaining *.backup files..."
Get-ChildItem "$root\src" -Recurse -Include *.backup

Write-Host ""
Write-Host "Running Lint..."
npm run lint
if($LASTEXITCODE -ne 0){ throw "Lint Failed" }

Write-Host ""
Write-Host "Running Build..."
npm run build
if($LASTEXITCODE -ne 0){ throw "Build Failed" }

Write-Host ""
Write-Host "Cleanup Completed Successfully."