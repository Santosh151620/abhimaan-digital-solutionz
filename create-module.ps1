param(
    [Parameter(Mandatory = $true)]
    [string]$Module
)

$moduleLower = $Module.ToLower()
$moduleTitle = (Get-Culture).TextInfo.ToTitleCase($moduleLower)

$dirs = @(
    "src\types\crm",
    "src\repositories\crm",
    "src\services\crm",
    "src\app\api\crm\$moduleLower",
    "src\app\crm\$moduleLower",
    "src\app\crm\$moduleLower\new",
    "src\app\crm\$moduleLower\[id]",
    "src\app\crm\$moduleLower\[id]\edit",
    "src\components\crm\$moduleLower"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

$files = @(
    "src\types\crm\$moduleTitle.ts",
    "src\repositories\crm\$moduleTitle`Repository.ts",
    "src\services\crm\$moduleTitle`Service.ts",

    "src\app\api\crm\$moduleLower\route.ts",

    "src\app\crm\$moduleLower\actions.ts",
    "src\app\crm\$moduleLower\page.tsx",
    "src\app\crm\$moduleLower\new\page.tsx",
    "src\app\crm\$moduleLower\[id]\page.tsx",
    "src\app\crm\$moduleLower\[id]\edit\page.tsx",

    "src\components\crm\$moduleLower\$moduleTitle`Table.tsx",
    "src\components\crm\$moduleLower\$moduleTitle`Form.tsx",
    "src\components\crm\$moduleLower\$moduleTitle`Summary.tsx",
    "src\components\crm\$moduleLower\index.ts"
)

foreach ($file in $files) {

    if (!(Test-Path -LiteralPath $file)) {

        New-Item `
            -ItemType File `
            -Path $file `
            -Force | Out-Null

    }

}

Write-Host ""
Write-Host "================================="
Write-Host " Module created successfully"
Write-Host "================================="
Write-Host ""