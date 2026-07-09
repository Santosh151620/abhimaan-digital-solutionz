<#
.SYNOPSIS
Abhimaan Digital Solutionz CRM
V0-3 CRM Module Factory

PowerShell 5.1 Compatible

Creates a complete CRM module scaffold.

This is the ONLY module generator.

Future modules:
- Companies
- Contacts
- Opportunities
- Tasks
- Calendar
- Activities
- Quotes
- Invoices
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ModuleName,

    [string]$ProjectRoot = (Resolve-Path "..").Path
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Ensure-Folder {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        New-Item -ItemType Directory -Path $Path | Out-Null
    }
}

function Write-File {
    param(
        [string]$Path,
        [string[]]$Content
    )

    $parent = Split-Path $Path

    if (-not (Test-Path -LiteralPath $parent)) {
        New-Item -ItemType Directory -Path $parent | Out-Null
    }

    Set-Content `
        -LiteralPath $Path `
        -Value $Content `
        -Encoding UTF8
}

$module = $ModuleName.Trim()

if ([string]::IsNullOrWhiteSpace($module)) {
    throw "ModuleName cannot be empty."
}

$route = $module.ToLower()

$base = Join-Path $ProjectRoot "src"

$pageRoot = Join-Path $base "app\crm\$route"

$componentRoot = Join-Path $base "components\crm\$route"

$serviceRoot = Join-Path $base "services\crm"

$repositoryRoot = Join-Path $base "repositories\crm"

$hookRoot = Join-Path $base "hooks\crm"

$typeRoot = Join-Path $base "types\crm"

$docRoot = Join-Path $ProjectRoot "docs\crm"

Write-Step "Creating folders"

$folders = @(
    $pageRoot,
    $componentRoot,
    $serviceRoot,
    $repositoryRoot,
    $hookRoot,
    $typeRoot,
    $docRoot
)

foreach ($folder in $folders) {
    Ensure-Folder $folder
}

Write-Step "Creating page"

$page = @(
"export default function Page() {",
"  return (",
"    <div className=""space-y-4"">",
"      <h1 className=""text-2xl font-bold"">$module</h1>",
"      <p>CRM Module</p>",
"    </div>",
"  );",
"}"
)

Write-File `
    -Path (Join-Path $pageRoot "page.tsx") `
    -Content $page

Write-Step "Creating component"

$component = @(
"export interface ${module}ListProps {",
"}",
"",
"export function ${module}List(props: ${module}ListProps) {",
"  return (",
"    <div>",
"      $module List",
"    </div>",
"  );",
"}"
)

Write-File `
    -Path (Join-Path $componentRoot "${module}List.tsx") `
    -Content $component

Write-Step "Creating service"

$service = @(
"export class ${module}Service {",
"  async list() {",
"    return [];",
"  }",
"}",
"",
"export const ${module}ServiceInstance = new ${module}Service();"
)

Write-File `
    -Path (Join-Path $serviceRoot "${module}Service.ts") `
    -Content $service

Write-Step "Creating repository"

$repository = @(
"export class ${module}Repository {",
"  async list() {",
"    return [];",
"  }",
"}",
"",
"export const ${module}RepositoryInstance = new ${module}Repository();"
)

Write-File `
    -Path (Join-Path $repositoryRoot "${module}Repository.ts") `
    -Content $repository

Write-Step "Creating hook"

$hook = @(
"export function use$module() {",
"  return {};",
"}"
)

Write-File `
    -Path (Join-Path $hookRoot "use${module}.ts") `
    -Content $hook

Write-Step "Creating types"

$types = @(
"export interface ${module} {",
"  id: string;",
"}"
)

Write-File `
    -Path (Join-Path $typeRoot "${module}.ts") `
    -Content $types

Write-Step "Creating documentation"

$doc = @(
"# $module",
"",
"## Purpose",
"",
"CRM Module",
"",
"## Features",
"",
"- Dashboard Ready",
"- Repository Pattern",
"- Service Layer",
"- Hook",
"- Types",
"",
"## Future",
"",
"- CRUD",
"- Search",
"- Filters",
"- Import",
"- Export",
"- Audit",
"- RBAC",
"- AI"
)

Write-File `
    -Path (Join-Path $docRoot "$module.md") `
    -Content $doc

Write-Host ""
Write-Host "Module created successfully." -ForegroundColor Green
Write-Host ""
Write-Host "Module : $module"
Write-Host "Route  : /crm/$route"