cd C:\Projects\MDSWEBSITE\abhimaan-digital-solutionz

Write-Host ""
Write-Host "========================================"
Write-Host " COMMAND PALETTE TARGET INSPECTION"
Write-Host "========================================"
Write-Host ""

$targets = @(
".\src\app\layout.tsx",
".\src\app\[locale]\layout.tsx",
".\src\app\providers.tsx",
".\src\components\Providers.tsx",
".\src\components\providers.tsx",
".\src\components\layout\AppLayout.tsx"
)

foreach($file in $targets){

    if(Test-Path -LiteralPath $file){

        Write-Host ""
        Write-Host "FOUND:"
        Write-Host $file
        Write-Host "----------------------------------------"

        Get-Content -LiteralPath $file

        Write-Host ""
        Write-Host "========================================"

    }

}

Write-Host ""
Write-Host "===== Existing UI Components ====="

Get-ChildItem ".\src\components" -Directory |
Select-Object Name

Write-Host ""
Write-Host "===== Existing Context Providers ====="

Get-ChildItem ".\src" -Recurse -Include *.tsx,*.ts |
Select-String "createContext|Context.Provider|Provider>" |
Select-Object Path,LineNumber,Line

Write-Host ""
Write-Host "===== Existing Keyboard Events ====="

Get-ChildItem ".\src" -Recurse -Include *.tsx,*.ts |
Select-String "keydown|ctrlKey|metaKey|Escape|event.key" |
Select-Object Path,LineNumber,Line

Write-Host ""
Write-Host "===== Existing Dialog / Modal ====="

Get-ChildItem ".\src" -Recurse -Include *.tsx |
Select-String "Dialog|Modal|Sheet|Popover" |
Select-Object Path,LineNumber,Line

Write-Host ""
Write-Host "Inspection Complete."