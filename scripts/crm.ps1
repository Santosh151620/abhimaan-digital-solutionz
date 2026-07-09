<#
===============================================================================
Abhimaan Digital Solutionz CRM Platform Factory
Version : V1.0.0
PowerShell : Windows PowerShell 5.1
===============================================================================

This is the ONLY CRM automation script.

Supported Commands

create
crud
api
docs
tests
sync
verify
doctor
clean
regenerate

Supported Modules

Companies
Contacts
Opportunities
Tasks
Calendar
Activities
Quotes
Invoices

===============================================================================
#>

[CmdletBinding()]
param(

    [Parameter(Position = 0)]
    [string]$Command,

    [Parameter(Position = 1)]
    [string]$Module,

    [Parameter(Position = 2)]
    [string]$Option

)

$ErrorActionPreference = "Stop"

$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path (Join-Path $ScriptRoot "..")

$Configuration = @{}

$FactoryVersion = "1.0.0"

$SupportedCommands = @(
    "create",
    "crud",
    "api",
    "docs",
    "tests",
    "verify",
    "doctor",
    "sync",
    "clean",
    "regenerate"
)

$SupportedModules = @(
    "Companies",
    "Contacts",
    "Opportunities",
    "Tasks",
    "Calendar",
    "Activities",
    "Quotes",
    "Invoices"
)

function Write-Section {

    param(
        [string]$Text
    )

    Write-Host ""
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host $Text -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host ""

}

function Write-Success {

    param(
        [string]$Text
    )

    Write-Host "[OK ] $Text" -ForegroundColor Green

}

function Write-WarningMessage {

    param(
        [string]$Text
    )

    Write-Host "[WARN] $Text" -ForegroundColor Yellow

}

function Write-ErrorMessage {

    param(
        [string]$Text
    )

    Write-Host "[FAIL] $Text" -ForegroundColor Red

}

function Stop-Factory {

    param(
        [string]$Message
    )

    Write-ErrorMessage $Message

    exit 1

}

function Ensure-Folder {

    param(
        [string]$Path
    )

    if (-not (Test-Path -LiteralPath $Path)) {

        New-Item `
            -ItemType Directory `
            -Path $Path | Out-Null

    }

}

function Write-TextFile {

    param(

        [string]$Path,

        [string[]]$Content

    )

    $parent = Split-Path -Parent $Path

    Ensure-Folder $parent

    Set-Content `
        -LiteralPath $Path `
        -Encoding UTF8 `
        -Value $Content

}

function Append-UniqueLine {

    param(

        [string]$Path,

        [string]$Line

    )

    if (-not (Test-Path -LiteralPath $Path)) {

        Set-Content `
            -LiteralPath $Path `
            -Encoding UTF8 `
            -Value @($Line)

        return

    }

    $content = Get-Content `
        -LiteralPath $Path

    if ($content -contains $Line) {

        return

    }

    Add-Content `
        -LiteralPath $Path `
        -Value $Line

}

function Replace-InFile {

    param(

        [string]$Path,

        [string]$Find,

        [string]$Replace

    )

    if (-not (Test-Path -LiteralPath $Path)) {

        return

    }

    $content = Get-Content `
        -LiteralPath $Path

    $content = $content -replace `
        [regex]::Escape($Find),
        $Replace

    Set-Content `
        -LiteralPath $Path `
        -Encoding UTF8 `
        -Value $content

}

function Get-ModuleRoute {

    param(
        [string]$Name
    )

    return $Name.ToLower()

}

function Get-ModuleFolders {

    param(
        [string]$Name
    )

    $route = Get-ModuleRoute $Name

    $src = Join-Path $ProjectRoot "src"

    return @{

        App = Join-Path $src "app\crm\$route"

        Components = Join-Path $src "components\crm\$route"

        Services = Join-Path $src "services\crm"

        Repository = Join-Path $src "repositories\crm"

        Hooks = Join-Path $src "hooks\crm"

        Types = Join-Path $src "types\crm"

        Validation = Join-Path $src "lib\validation"

        Api = Join-Path $src "app\api\crm\$route"

        Docs = Join-Path $ProjectRoot "docs\crm\modules"

        Tests = Join-Path $ProjectRoot "tests\crm"

        Config = Join-Path $src "config\crm"

    }

}

function Assert-Module {

    param(
        [string]$Name
    )

    if ($SupportedModules -notcontains $Name) {

        Stop-Factory "Unsupported module [$Name]."

    }

}

function Assert-Command {

    param(
        [string]$Name
    )

    if ($SupportedCommands -notcontains $Name) {

        Stop-Factory "Unsupported command [$Name]."

    }

}

function Show-Banner {

    Write-Section "ABHIMAAN DIGITAL SOLUTIONZ CRM FACTORY"

    Write-Host "Version : $FactoryVersion"
    Write-Host "PowerShell : 5.1"
    Write-Host "Project : $ProjectRoot"

    Write-Host ""

}

function Load-Configuration {

    $config = Join-Path $ScriptRoot "config.json"

    if (-not (Test-Path -LiteralPath $config)) {

        Stop-Factory "config.json not found."

    }

    $json = Get-Content `
        -LiteralPath $config `
        -Raw

    $script:Configuration = ConvertFrom-Json $json

    Write-Success "Configuration Loaded"

}

function Show-Summary {

    Write-Host ""
    Write-Host "Factory Version : $FactoryVersion"
    Write-Host "Command         : $Command"
    Write-Host "Module          : $Module"
    Write-Host ""

}

Show-Banner

Load-Configuration
function New-ModuleFolders {

    param(
        [string]$ModuleName
    )

    Assert-Module $ModuleName

    $paths = Get-ModuleFolders $ModuleName

    foreach ($item in $paths.Keys) {

        Ensure-Folder $paths[$item]

        Write-Success ("Folder : " + $paths[$item])

    }

}

function New-ModulePage {

    param(
        [string]$ModuleName
    )

    $paths = Get-ModuleFolders $ModuleName

    $file = Join-Path $paths.App "page.tsx"

    Write-TextFile `
        -Path $file `
        -Content @(
"export default function Page() {",
"    return (",
"        <div className=""space-y-4"">",
"            <h1 className=""text-2xl font-bold"">$ModuleName</h1>",
"            <p>$ModuleName Module</p>",
"        </div>",
"    );",
"}"
)

    Write-Success "Created page.tsx"

}

function New-ModuleType {

    param(
        [string]$ModuleName
    )

    $paths = Get-ModuleFolders $ModuleName

    $file = Join-Path $paths.Types ($ModuleName + ".ts")

    Write-TextFile `
        -Path $file `
        -Content @(
"export interface $ModuleName {",
"    id: string;",
"    createdAt: string;",
"    updatedAt: string;",
"}"
)

    Write-Success "Created Type"

}

function New-Repository {

    param(
        [string]$ModuleName
    )

    $paths = Get-ModuleFolders $ModuleName

    $file = Join-Path $paths.Repository ($ModuleName + "Repository.ts")

    Write-TextFile `
        -Path $file `
        -Content @(
"export class ${ModuleName}Repository {",
"",
"    async findAll() {",
"        return [];",
"    }",
"",
"    async findById(id: string) {",
"        return null;",
"    }",
"",
"}",
"",
"export const ${ModuleName}RepositoryInstance = new ${ModuleName}Repository();"
)

    Write-Success "Created Repository"

}

function New-Service {

    param(
        [string]$ModuleName
    )

    $paths = Get-ModuleFolders $ModuleName

    $file = Join-Path $paths.Services ($ModuleName + "Service.ts")

    Write-TextFile `
        -Path $file `
        -Content @(
"import { ${ModuleName}RepositoryInstance } from '@/repositories/crm/${ModuleName}Repository';",
"",
"export class ${ModuleName}Service {",
"",
"    async list() {",
"        return ${ModuleName}RepositoryInstance.findAll();",
"    }",
"",
"    async details(id: string) {",
"        return ${ModuleName}RepositoryInstance.findById(id);",
"    }",
"",
"}",
"",
"export const ${ModuleName}ServiceInstance = new ${ModuleName}Service();"
)

    Write-Success "Created Service"

}

function New-Hook {

    param(
        [string]$ModuleName
    )

    $paths = Get-ModuleFolders $ModuleName

    $file = Join-Path $paths.Hooks ("use" + $ModuleName + ".ts")

    Write-TextFile `
        -Path $file `
        -Content @(
"import { useEffect } from 'react';",
"",
"export function use$ModuleName() {",
"",
"    useEffect(() => {",
"",
"    }, []);",
"",
"    return {};",
"",
"}"
)

    Write-Success "Created Hook"

}

function New-Validation {

    param(
        [string]$ModuleName
    )

    $paths = Get-ModuleFolders $ModuleName

    $file = Join-Path $paths.Validation ($ModuleName + ".ts")

    Write-TextFile `
        -Path $file `
        -Content @(
"export const ${ModuleName}ValidationSchema = {};",
"",
"export const default${ModuleName}Values = {};")
    
    Write-Success "Created Validation"

}

function New-ComponentFolder {

    param(
        [string]$ModuleName
    )

    $paths = Get-ModuleFolders $ModuleName

    Ensure-Folder $paths.Components

    Write-Success "Component Folder Ready"

}

function New-Module {

    param(
        [string]$ModuleName
    )

    Write-Section ("Creating Module : " + $ModuleName)

    New-ModuleFolders $ModuleName

    New-ModulePage $ModuleName

    New-ModuleType $ModuleName

    New-Repository $ModuleName

    New-Service $ModuleName

    New-Hook $ModuleName

    New-Validation $ModuleName

    New-ComponentFolder $ModuleName

    Write-Success "Module Base Completed"

}
function New-CRUDPages {

    param(
        [string]$ModuleName
    )

    Assert-Module $ModuleName

    $paths = Get-ModuleFolders $ModuleName

    $folders = @(
        "new",
        "[id]",
        "[id]\edit"
    )

    foreach ($folder in $folders) {

        Ensure-Folder (Join-Path $paths.App $folder)

    }

    Write-TextFile `
        -Path (Join-Path $paths.App "new\page.tsx") `
        -Content @(
"export default function New${ModuleName}Page() {",
"    return <div>Create $ModuleName</div>;",
"}"
)

    Write-TextFile `
        -Path (Join-Path $paths.App "[id]\page.tsx") `
        -Content @(
"interface PageProps {",
"    params: Promise<{ id: string }>;",
"}",
"",
"export default async function ${ModuleName}DetailsPage({ params }: PageProps) {",
"    const { id } = await params;",
"",
"    return <div>$ModuleName Details : {id}</div>;",
"}"
)

    Write-TextFile `
        -Path (Join-Path $paths.App "[id]\edit\page.tsx") `
        -Content @(
"interface PageProps {",
"    params: Promise<{ id: string }>;",
"}",
"",
"export default async function Edit${ModuleName}Page({ params }: PageProps) {",
"    const { id } = await params;",
"",
"    return <div>Edit $ModuleName : {id}</div>;",
"}"
)

    Write-Success "CRUD Pages Created"

}

function New-DataTable {

    param(
        [string]$ModuleName
    )

    $paths = Get-ModuleFolders $ModuleName

    Write-TextFile `
        -Path (Join-Path $paths.Components ($ModuleName + "Columns.ts")) `
        -Content @(
"export const ${ModuleName}Columns = [",
"    {",
"        accessorKey: 'id',",
"        header: 'ID'",
"    }",
"];"
)

    Write-TextFile `
        -Path (Join-Path $paths.Components ($ModuleName + "DataTable.tsx")) `
        -Content @(
"export function ${ModuleName}DataTable() {",
"    return (",
"        <div>${ModuleName} DataTable</div>",
"    );",
"}"
)

    Write-Success "DataTable Created"

}

    Write-TextFile `
        -Path (Join-Path $paths.Components ($ModuleName + "DataTable.tsx")) `
        -Content @(
"interface Props {",
"}",
"",
"export function ${ModuleName}DataTable(props: Props) {",
"",
"    return (",
"        <div>$ModuleName DataTable</div>",
"    );",
"",
"}"
)

    Write-Success "DataTable Created"

}

function New-Toolbar {

    param(
        [string]$ModuleName
    )

    $paths = Get-ModuleFolders $ModuleName

    Write-TextFile `
        -Path (Join-Path $paths.Components ($ModuleName + "Toolbar.tsx")) `
        -Content @(
"export function ${ModuleName}Toolbar() {",
"",
"    return (",
"        <div>$ModuleName Toolbar</div>",
"    );",
"",
"}"
)

    Write-Success "Toolbar Created"

}

function New-Filters {

    param(
        [string]$ModuleName
    )

    $paths = Get-ModuleFolders $ModuleName

    Write-TextFile `
        -Path (Join-Path $paths.Components ($ModuleName + "Filters.tsx")) `
        -Content @(
"export function ${ModuleName}Filters() {",
"",
"    return (",
"        <div>$ModuleName Filters</div>",
"    );",
"",
"}"
)

    Write-Success "Filters Created"

}

function New-Form {

    param(
        [string]$ModuleName
    )

    $paths = Get-ModuleFolders $ModuleName

    Write-TextFile `
        -Path (Join-Path $paths.Components ($ModuleName + "Form.tsx")) `
        -Content @(
"export function ${ModuleName}Form() {",
"",
"    return (",
"        <div>$ModuleName Form</div>",
"    );",
"",
"}"
)

    Write-Success "Form Created"

}

function New-ComponentSet {

    param(
        [string]$ModuleName
    )

    Write-Section ("Generating Component Set : " + $ModuleName)

    New-DataTable $ModuleName

    New-Toolbar $ModuleName

    New-Filters $ModuleName

    New-Form $ModuleName

    Write-Success "Component Set Completed"

}
function New-ApiRoutes {

    param(
        [string]$ModuleName
    )

    Assert-Module $ModuleName

    $paths = Get-ModuleFolders $ModuleName

    Ensure-Folder $paths.Api
    Ensure-Folder (Join-Path $paths.Api "[id]")

    Write-TextFile `
        -Path (Join-Path $paths.Api "route.ts") `
        -Content @(
"export async function GET() {",
"    return Response.json([]);",
"}",
"",
"export async function POST() {",
"    return Response.json({ success: true });",
"}"
)

    Write-TextFile `
        -Path (Join-Path $paths.Api "[id]\route.ts") `
        -Content @(
"export async function GET() {",
"    return Response.json({});",
"}",
"",
"export async function PUT() {",
"    return Response.json({ success: true });",
"}",
"",
"export async function DELETE() {",
"    return Response.json({ success: true });",
"}"
)

    Write-Success "API Routes Created"

}

function New-ServerActions {

    param(
        [string]$ModuleName
    )

    $paths = Get-ModuleFolders $ModuleName

    Write-TextFile `
        -Path (Join-Path $paths.App "actions.ts") `
        -Content @(
"'use server';",
"",
"export async function getAll() {",
"    return [];",
"}",
"",
"export async function getById(id: string) {",
"    return null;",
"}",
"",
"export async function create(data: unknown) {",
"    return { success: true };",
"}",
"",
"export async function update(id: string, data: unknown) {",
"    return { success: true };",
"}",
"",
"export async function remove(id: string) {",
"    return { success: true };",
"}"
)

    Write-Success "Server Actions Created"

}

function New-TestScaffold {

    param(
        [string]$ModuleName
    )

    $paths = Get-ModuleFolders $ModuleName

    Write-TextFile `
        -Path (Join-Path $paths.Tests ($ModuleName + ".test.ts")) `
        -Content @(
"describe('$ModuleName', () => {",
"",
"    it('should load', () => {",
"        expect(true).toBe(true);",
"    });",
"",
"});"
)

    Write-Success "Tests Created"

}

function New-ModuleDocumentation {

    param(
        [string]$ModuleName
    )

    $paths = Get-ModuleFolders $ModuleName

    Write-TextFile `
        -Path (Join-Path $paths.Docs ($ModuleName + ".md")) `
        -Content @(
"# $ModuleName",
"",
"## Overview",
"",
"CRM Module",
"",
"## Features",
"",
"- List",
"- Create",
"- Details",
"- Edit",
"- Delete",
"",
"## Components",
"",
"- DataTable",
"- Toolbar",
"- Filters",
"- Form",
"",
"## Repository",
"",
"## Service",
"",
"## Future Roadmap",
"",
"- Import",
"- Export",
"- Audit",
"- AI",
"- Automation"
)

    Write-Success "Documentation Created"

}

function Register-Module {

    param(
        [string]$ModuleName
    )

    $paths = Get-ModuleFolders $ModuleName

    Ensure-Folder $paths.Config

    $registry = Join-Path $paths.Config "modules.generated.ts"

    $route = $ModuleName.ToLower()

    $content = @(
"export const crmModules = [",
"    ""$route""",
"] as const;"
    )

    Write-TextFile `
        -Path $registry `
        -Content $content

    Write-Success "Module Registered"

}


    Append-UniqueLine `
        -Path $registry `
        -Line ("    '" + ($ModuleName.ToLower()) + "',")

    Write-Success "Module Registered"

}

function New-ModulePackage {

    param(
        [string]$ModuleName
    )

    Write-Section ("Generating Complete Package : " + $ModuleName)

    New-CRUDPages $ModuleName

    New-ComponentSet $ModuleName

    New-ApiRoutes $ModuleName

    New-ServerActions $ModuleName

    New-TestScaffold $ModuleName

    New-ModuleDocumentation $ModuleName

    Register-Module $ModuleName

    Write-Success "Complete Module Package Generated"

}
function Invoke-Lint {

    Write-Section "Running ESLint"

    npm run lint

    if ($LASTEXITCODE -ne 0) {

        Stop-Factory "Lint failed."

    }

    Write-Success "Lint Passed"

}

function Invoke-Build {

    Write-Section "Running Build"

    npm run build

    if ($LASTEXITCODE -ne 0) {

        Stop-Factory "Build failed."

    }

    Write-Success "Build Passed"

}

function Invoke-Verify {

    param(
        [string]$ModuleName
    )

    Assert-Module $ModuleName

    $paths = Get-ModuleFolders $ModuleName

    $required = @(

        (Join-Path $paths.App "page.tsx"),

        (Join-Path $paths.Repository ($ModuleName + "Repository.ts")),

        (Join-Path $paths.Services ($ModuleName + "Service.ts")),

        (Join-Path $paths.Types ($ModuleName + ".ts")),

        (Join-Path $paths.Hooks ("use" + $ModuleName + ".ts")),

        (Join-Path $paths.Components ($ModuleName + "DataTable.tsx"))

    )

    foreach ($file in $required) {

        if (Test-Path -LiteralPath $file) {

            Write-Success $file

        }
        else {

            Write-WarningMessage ("Missing : " + $file)

        }

    }

}

function Invoke-Doctor {

    Write-Section "CRM Factory Diagnostics"

    Write-Host ""
    Write-Host "Factory Version : $FactoryVersion"
    Write-Host "Project Root    : $ProjectRoot"
    Write-Host "Script Root     : $ScriptRoot"
    Write-Host ""

    if (Test-Path -LiteralPath (Join-Path $ScriptRoot "config.json")) {

        Write-Success "config.json"

    }
    else {

        Write-WarningMessage "config.json missing"

    }

    if (Test-Path -LiteralPath (Join-Path $ScriptRoot "common.ps1")) {

        Write-Success "common.ps1"

    }
    else {

        Write-WarningMessage "common.ps1 missing"

    }

}

function Invoke-Clean {

    Write-Section "Clean"

    Write-Host "Nothing to clean."

    Write-Success "Completed"

}

function Invoke-Sync {

    Write-Section "Sync"

    Write-Host "Future implementation."

    Write-Success "Completed"

}

function Invoke-Regenerate {

    param(
        [string]$ModuleName
    )

    Assert-Module $ModuleName

    Write-Section ("Regenerating " + $ModuleName)

    New-Module $ModuleName

    New-ModulePackage $ModuleName

    Write-Success "Regeneration Complete"

}

function Invoke-Create {

    param(
        [string]$ModuleName
    )

    Assert-Module $ModuleName

    Write-Section ("Creating " + $ModuleName)

    New-Module $ModuleName

    New-ModulePackage $ModuleName

    Write-Success "Module Generation Complete"

}

Assert-Command $Command

switch ($Command) {

    "create" {

        Invoke-Create $Module

        break

    }

    "crud" {

        New-CRUDPages $Module

        break

    }

    "api" {

        New-ApiRoutes $Module

        break

    }

    "docs" {

        New-ModuleDocumentation $Module

        break

    }

    "tests" {

        New-TestScaffold $Module

        break

    }

    "verify" {

        Invoke-Verify $Module

        break

    }

    "doctor" {

        Invoke-Doctor

        break

    }

    "sync" {

        Invoke-Sync

        break

    }

    "clean" {

        Invoke-Clean

        break

    }

    "regenerate" {

        Invoke-Regenerate $Module

        break

    }

}

Show-Summary

Write-Host ""
Write-Host "==============================================" -ForegroundColor Green
Write-Host " CRM FACTORY COMPLETED SUCCESSFULLY" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""