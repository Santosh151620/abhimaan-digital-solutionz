# =====================================================================
# Export-SprintPackage.ps1
# PowerShell 5.1
# Creates ONE Sprint ZIP containing everything required for development.
# =====================================================================

$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

$ExportRoot = Join-Path $ProjectRoot "SprintPackage"

if(Test-Path $ExportRoot){
    Remove-Item $ExportRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $ExportRoot | Out-Null

$Folders = @(
"src\app\[locale]\dashboard",
"src\modules",
"src\services",
"src\components",
"src\hooks",
"src\lib",
"src\types",
"src\utils",
"src\providers",
"src\contexts",
"src\styles",
"prisma"
)

foreach($folder in $Folders){

    $Source = Join-Path $ProjectRoot $folder

    if(Test-Path -LiteralPath $Source){

        $Destination = Join-Path $ExportRoot $folder

        $Parent = Split-Path $Destination

        if(!(Test-Path $Parent)){
            New-Item -ItemType Directory -Path $Parent -Force | Out-Null
        }

        Copy-Item -LiteralPath $Source `
            -Destination $Destination `
            -Recurse `
            -Force
    }
}

$RootFiles = @(
"package.json",
"package-lock.json",
"tsconfig.json",
"next.config.js",
"next.config.mjs",
"tailwind.config.js",
"tailwind.config.ts",
"postcss.config.js",
".eslintrc.json",
".eslintrc.js",
"eslint.config.js"
)

foreach($file in $RootFiles){

    $Source = Join-Path $ProjectRoot $file

    if(Test-Path $Source){
        Copy-Item $Source $ExportRoot -Force
    }
}

$Zip = Join-Path $ProjectRoot "SprintPackage.zip"

if(Test-Path $Zip){
    Remove-Item $Zip -Force
}

Compress-Archive `
    -Path "$ExportRoot\*" `
    -DestinationPath $Zip `
    -CompressionLevel Optimal

Write-Host ""
Write-Host "==========================================="
Write-Host "Sprint Package Created"
Write-Host $Zip
Write-Host "==========================================="