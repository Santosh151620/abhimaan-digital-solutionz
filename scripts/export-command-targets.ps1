cd C:\Projects\MDSWEBSITE\abhimaan-digital-solutionz

$out = ".\command-palette-inspection.txt"

if(Test-Path $out){
    Remove-Item $out -Force
}

function Add-Line{
    param([string]$Text)
    Add-Content -Path $out -Value $Text
}

Add-Line "========================================"
Add-Line "COMMAND PALETTE TARGET INSPECTION"
Add-Line "========================================"
Add-Line ""

$targets=@(
".\src\app\layout.tsx",
".\src\app\[locale]\layout.tsx",
".\src\app\providers.tsx",
".\src\components\Providers.tsx",
".\src\components\providers.tsx",
".\src\components\layout\AppLayout.tsx"
)

foreach($file in $targets){

    if(Test-Path -LiteralPath $file){

        Add-Line "FOUND: $file"
        Add-Line "----------------------------------------"

        Get-Content -LiteralPath $file | Add-Content $out

        Add-Line ""
        Add-Line "========================================"
        Add-Line ""

    }

}

Add-Line "===== Existing Context Providers ====="

Get-ChildItem ".\src" -Recurse -Include *.ts,*.tsx |
Select-String "createContext|Context.Provider|Provider>" |
ForEach-Object{
    Add-Line ($_.Path + ":" + $_.LineNumber)
    Add-Line $_.Line
    Add-Line ""
}

Add-Line "===== Existing Keyboard Events ====="

Get-ChildItem ".\src" -Recurse -Include *.ts,*.tsx |
Select-String "keydown|ctrlKey|metaKey|Escape|event.key" |
ForEach-Object{
    Add-Line ($_.Path + ":" + $_.LineNumber)
    Add-Line $_.Line
    Add-Line ""
}

Write-Host ""
Write-Host "Created:"
Write-Host $out