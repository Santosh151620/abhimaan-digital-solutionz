Set-StrictMode -Version Latest

function Get-ModuleContext {

    param(
        [string]$Module
    )

    $route = $Module.ToLower()

    @{
        Module = $Module
        ModuleLower = $route
        Route = $route
        DisplayName = $Module
    }

}

function Expand-Template {

    param(
        [string[]]$Template,
        [hashtable]$Context
    )

    $result = @()

    foreach ($line in $Template) {

        $text = $line

        foreach ($key in $Context.Keys) {

            $text = $text.Replace("{{" + $key + "}}",[string]$Context[$key])

        }

        $result += $text

    }

    return $result

}

function Write-Template {

    param(

        [string]$Path,

        [string[]]$Template,

        [hashtable]$Context,

        [switch]$Force

    )

    Write-TextFile `
        -Path $Path `
        -Content (Expand-Template $Template $Context) `
        -Force:$Force

}

# --------------------------------------------------
# Pages
# --------------------------------------------------

function Get-PageTemplate {

@(
"import { {{Module}}DataTable } from '@/components/crm/{{ModuleLower}}';",
"",
"export default function {{Module}}Page() {",
"    return <{{Module}}DataTable />;",
"}"
)

}

function Get-NewPageTemplate {

@(
"import { {{Module}}Form } from '@/components/crm/{{ModuleLower}}';",
"",
"export default function New{{Module}}Page() {",
"    return <{{Module}}Form />;",
"}"
)

}

function Get-DetailsPageTemplate {

@(
"interface PageProps {",
"    params: Promise<{ id: string }>;",
"}",
"",
"export default async function {{Module}}DetailsPage(",
"    { params }: PageProps",
") {",
"",
"    const { id } = await params;",
"",
"    return <div>{id}</div>;",
"",
"}"
)

}

function Get-EditPageTemplate {

@(
"import { {{Module}}Form } from '@/components/crm/{{ModuleLower}}';",
"",
"export default function Edit{{Module}}Page() {",
"",
"    return <{{Module}}Form />;",
"",
"}"
)

}

# --------------------------------------------------
# Components
# --------------------------------------------------

function Get-DataTableTemplate {

@(
"export function {{Module}}DataTable() {",
"",
"    return (",
"        <div>{{DisplayName}}</div>",
"    );",
"",
"}"
)

}

function Get-ColumnsTemplate {

@(
"export const {{Module}}Columns = [];"
)

}

function Get-ToolbarTemplate {

@(
"export function {{Module}}Toolbar() {",
"    return null;",
"}"
)

}

function Get-FiltersTemplate {

@(
"export function {{Module}}Filters() {",
"    return null;",
"}"
)

}

function Get-FormTemplate {

@(
"export function {{Module}}Form() {",
"",
"    return (",
"        <form>",
"            <div>{{DisplayName}} Form</div>",
"        </form>",
"    );",
"",
"}"
)

}

# --------------------------------------------------
# Barrel
# --------------------------------------------------

function Get-BarrelTemplate {

@(
"export * from './{{Module}}DataTable';",
"export * from './{{Module}}Columns';",
"export * from './{{Module}}Toolbar';",
"export * from './{{Module}}Filters';",
"export * from './{{Module}}Form';"
)

}