[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleName,

    [string]$ProjectRoot = (Resolve-Path "..").Path
)

$ErrorActionPreference = "Stop"

$module = $ModuleName.Trim()

$validationRoot = Join-Path $ProjectRoot "src\lib\validation"

if (-not (Test-Path -LiteralPath $validationRoot)) {
    New-Item -ItemType Directory -Path $validationRoot | Out-Null
}

Set-Content `
-LiteralPath (Join-Path $validationRoot ($module + ".ts")) `
-Encoding UTF8 `
-Value @(
"export const ${module}ValidationSchema = {};",
"",
"export const default${module}Values = {};")