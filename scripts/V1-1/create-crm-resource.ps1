[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleName,

    [Parameter(Mandatory = $true)]
    [string]$ResourceName,

    [string]$ProjectRoot = (Resolve-Path "..").Path
)

$ErrorActionPreference = "Stop"

$module = $ModuleName.Trim().ToLower()
$resource = $ResourceName.Trim()

if ([string]::IsNullOrWhiteSpace($module)) {
    throw "ModuleName is required."
}

if ([string]::IsNullOrWhiteSpace($resource)) {
    throw "ResourceName is required."
}

$src = Join-Path $ProjectRoot "src"

$folders = @(
    (Join-Path $src "components\crm\$module"),
    (Join-Path $src "services\crm"),
    (Join-Path $src "repositories\crm"),
    (Join-Path $src "hooks\crm"),
    (Join-Path $src "types\crm"),
    (Join-Path $src "lib\validation")
)

foreach ($folder in $folders) {
    if (-not (Test-Path -LiteralPath $folder)) {
        New-Item -ItemType Directory -Path $folder | Out-Null
    }
}

Set-Content `
-LiteralPath (Join-Path $src "types\crm\$resource.ts") `
-Encoding UTF8 `
-Value @(
"export interface $resource {",
"  id: string;",
"  createdAt: string;",
"  updatedAt: string;",
"}"
)

Set-Content `
-LiteralPath (Join-Path $src "repositories\crm\${resource}Repository.ts") `
-Encoding UTF8 `
-Value @(
"export class ${resource}Repository {",
"  async findAll() {",
"    return [];",
"  }",
"}",
"",
"export const ${resource}RepositoryInstance = new ${resource}Repository();"
)

Set-Content `
-LiteralPath (Join-Path $src "services\crm\${resource}Service.ts") `
-Encoding UTF8 `
-Value @(
"import { ${resource}RepositoryInstance } from '@/repositories/crm/${resource}Repository';",
"",
"export class ${resource}Service {",
"  async findAll() {",
"    return ${resource}RepositoryInstance.findAll();",
"  }",
"}",
"",
"export const ${resource}ServiceInstance = new ${resource}Service();"
)

Set-Content `
-LiteralPath (Join-Path $src "hooks\crm\use${resource}.ts") `
-Encoding UTF8 `
-Value @(
"import { useEffect } from 'react';",
"",
"export function use${resource}() {",
"  useEffect(() => {}, []);",
"}"
)

Set-Content `
-LiteralPath (Join-Path $src "components\crm\$module\${resource}Table.tsx") `
-Encoding UTF8 `
-Value @(
"export function ${resource}Table() {",
"  return <div>${resource} Table</div>;",
"}"
)

Write-Host ""
Write-Host "$resource resource generated successfully." -ForegroundColor Green