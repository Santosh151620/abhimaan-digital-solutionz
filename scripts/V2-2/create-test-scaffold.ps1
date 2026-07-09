[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleName,

    [string]$ProjectRoot = (Resolve-Path "..").Path
)

$ErrorActionPreference = "Stop"

$module = $ModuleName.Trim()

$testRoot = Join-Path $ProjectRoot "tests\crm"

if (-not (Test-Path -LiteralPath $testRoot)) {
    New-Item -ItemType Directory -Path $testRoot | Out-Null
}

Set-Content `
-LiteralPath (Join-Path $testRoot ($module + ".test.ts")) `
-Encoding UTF8 `
-Value @(
"describe('$module', () => {",
"  it('should load', () => {",
"    expect(true).toBe(true);",
"  });",
"});"
)

Write-Host ""
Write-Host "Test scaffold created." -ForegroundColor Green