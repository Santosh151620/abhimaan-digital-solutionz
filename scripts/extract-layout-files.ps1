$files = @(
"src\app\layout.tsx",
"src\app\[locale]\layout.tsx",
"src\components\layout\Header.tsx"
)

foreach($file in $files){

    Write-Host ""
    Write-Host "===================================="
    Write-Host $file
    Write-Host "===================================="

    if(Test-Path -LiteralPath $file){

        Get-Content -LiteralPath $file

    }
    else{

        Write-Host "MISSING"

    }
}

Write-Host ""
Write-Host "=== COMPLETE ==="