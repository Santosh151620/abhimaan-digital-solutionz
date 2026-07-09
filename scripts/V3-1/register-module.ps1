[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleName,

    [string]$ProjectRoot = (Resolve-Path "..").Path
)

$ErrorActionPreference = "Stop"

$route = $ModuleName.Trim().ToLower()

$registry = Join-Path $ProjectRoot "src\config\crm\modules.generated.ts"

if (-not (Test-Path -LiteralPath $registry)) {
    Set-Content `
    -LiteralPath $registry `
    -Encoding UTF8 `
    -Value @(
"export const crmModules = [",
"];"
    )
}

$content = Get-Content -LiteralPath $registry

$entry = "  '$route',"

if ($content -contains $entry) {
    Write-Host "Module already registered."
    exit 0
}

$newContent = @()

foreach ($line in $content) {

    if ($line -eq "];") {
        $newContent += $entry
    }

    $newContent += $line
}

Set-Content `
-LiteralPath $registry `
-Encoding UTF8 `
-Value $newContent

Write-Host ""
Write-Host "Module registered." -ForegroundColor Green