Write-Host ""
Write-Host "========================================="
Write-Host " Phase 3.10 - Barrel Export Audit"
Write-Host "========================================="
Write-Host ""

$root = Resolve-Path "$PSScriptRoot\.."

Write-Host "Barrel Files"
Write-Host "------------"

$barrels = Get-ChildItem "$root\src" -Recurse -Filter index.ts |
Sort-Object FullName

$barrels | Select-Object FullName

Write-Host ""
Write-Host "===================================="

foreach($barrel in $barrels){

    Write-Host ""
    Write-Host $barrel.FullName
    Write-Host "--------------------------------"

    $content = Get-Content $barrel.FullName

    $exports = $content | Where-Object {
        $_ -match "^export "
    }

    Write-Host ("Exports : " + $exports.Count)

    $exports | Select-Object -First 20

}

Write-Host ""
Write-Host "Searching duplicate exports..."
Write-Host ""

Get-ChildItem "$root\src" -Recurse -Include *.ts |
Select-String "^export .* from" |
ForEach-Object{

    if($_.Line -match "from ['""](.+)['""]"){
        [PSCustomObject]@{
            Export=$Matches[1]
            Path=$_.Path
        }
    }

} |
Group-Object Export |
Where-Object {$_.Count -gt 1} |
Sort-Object Count -Descending |
Format-Table Count,Name -Auto

Write-Host ""
Write-Host "Directories missing index.ts"
Write-Host ""

Get-ChildItem "$root\src" -Directory -Recurse |
Where-Object{

    (Get-ChildItem $_.FullName -File -Filter *.ts -ErrorAction SilentlyContinue).Count -gt 1 -and
    !(Test-Path (Join-Path $_.FullName "index.ts"))

} |
Select FullName

Write-Host ""
Write-Host "Running Lint..."
npm run lint
if($LASTEXITCODE -ne 0){ throw "Lint Failed" }

Write-Host ""

Write-Host "Running Build..."
npm run build
if($LASTEXITCODE -ne 0){ throw "Build Failed" }

Write-Host ""
Write-Host "Barrel Export Audit Completed."