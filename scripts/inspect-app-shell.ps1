$root = Get-Location

$targets = @(
"src\app\[locale]\layout.tsx",
"src\app\layout.tsx",
"src\components\layout",
"src\components\ui",
"src\components"
)

foreach($target in $targets){

    Write-Host ""
    Write-Host "=================================="
    Write-Host $target
    Write-Host "=================================="

    $path = Join-Path $root $target

    if(Test-Path -LiteralPath $path){

        $item = Get-Item -LiteralPath $path

        if($item.PSIsContainer){

            Get-ChildItem -LiteralPath $path -Recurse -File -Include *.tsx,*.ts |
            ForEach-Object{

                Write-Host ""
                Write-Host "---- FILE ----"
                Write-Host $_.FullName

                Get-Content -LiteralPath $_.FullName
            }

        }else{

            Get-Content -LiteralPath $path

        }

    }else{

        Write-Host "MISSING"

    }
}

Write-Host ""
Write-Host "=== APP SHELL SCAN COMPLETE ==="