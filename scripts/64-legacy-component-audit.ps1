Write-Host ""
Write-Host "======================================="
Write-Host " Phase 3.4 - Legacy Component Audit"
Write-Host "======================================="
Write-Host ""

$root = Resolve-Path "$PSScriptRoot\.."

$legacyFiles = Get-ChildItem "$root\src" -Recurse -Include *Legacy*.ts,*Legacy*.tsx

if($legacyFiles.Count -eq 0){
    Write-Host "No legacy files found."
}
else{

    foreach($file in $legacyFiles){

        Write-Host ""
        Write-Host "===================================="
        Write-Host $file.FullName
        Write-Host "===================================="

        $name = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
        $escaped = [regex]::Escape($name)

        $refs = Get-ChildItem "$root\src" -Recurse -Include *.ts,*.tsx |
            Where-Object { $_.FullName -ne $file.FullName } |
            Select-String $escaped

        if($refs){
            Write-Host "USED"
            $refs | Select Path,LineNumber
        }
        else{
            Write-Host "UNUSED"
        }
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
Write-Host "Audit Complete."