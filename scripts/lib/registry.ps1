Set-StrictMode -Version Latest

function Get-RegistryFolder {

    return (Join-Path $Script:ProjectRoot "src\config\crm")

}

function Get-RegisteredModules {

    $folder = Get-RegistryFolder

    $file = Join-Path $folder "modules.generated.ts"

    if (-not (Test-Path -LiteralPath $file)) {

        return @()

    }

    $modules = @()

    foreach ($line in Get-Content -LiteralPath $file) {

        if ($line -match "'([^']+)'") {

            $modules += $Matches[1]

        }

    }

    return ($modules | Sort-Object -Unique)

}

function Register-All {

    param(

        [Parameter(Mandatory=$true)]
        [string]$Module

    )

    $folder = Get-RegistryFolder

    Ensure-Folder $folder

    $modules = Get-RegisteredModules

    if ($modules -notcontains $Module) {

        $modules += $Module

    }

    $modules = $modules | Sort-Object -Unique

    $content = @()

    $content += "export const crmModules = ["

    foreach ($m in $modules) {

        $content += "    '$m',"

    }

    $content += "] as const;"
    $content += ""
    $content += "export default crmModules;"

    Write-TextFile `
        -Path (Join-Path $folder "modules.generated.ts") `
        -Content $content `
        -Force

    Write-TextFile `
        -Path (Join-Path $folder "navigation.generated.ts") `
        -Content @(
"import crmModules from './modules.generated';",
"",
"export const crmNavigation = crmModules;",
"",
"export default crmNavigation;"
) `
        -Force

    Write-TextFile `
        -Path (Join-Path $folder "command-palette.generated.ts") `
        -Content @(
"import crmModules from './modules.generated';",
"",
"export const crmCommandPalette = crmModules;",
"",
"export default crmCommandPalette;"
) `
        -Force

    Write-Success ("Module Registered : " + $Module)

}