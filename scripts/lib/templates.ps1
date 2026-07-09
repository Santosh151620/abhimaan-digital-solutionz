Set-StrictMode -Version Latest

function Get-ModuleContext {

    param(
        [string]$Module
    )

    $route = $Module.ToLower()

    return @{

        Module = $Module

        Route = $route

        DisplayName = $Module

        Repository = "${Module}Repository"

        Service = "${Module}Service"

        Hook = "use${Module}"

        Type = $Module

        Validation = "${Module}Schema"

        RouteUrl = "/crm/$route"

        ApiUrl = "/api/crm/$route"

    }

}

function Expand-Template {

    param(

        [string[]]$Lines,

        [hashtable]$Context

    )

    $result = @()

    foreach ($line in $Lines) {

        $text = $line

        foreach ($key in $Context.Keys) {

            $token = "{{" + $key + "}}"

            $text = $text.Replace($token,[string]$Context[$key])

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

    $content = Expand-Template `
        -Lines $Template `
        -Context $Context

    Write-TextFile `
        -Path $Path `
        -Content $content `
        -Force:$Force

}

function Get-PageTemplate {

    return @(
"export default function {{Module}}Page() {",
"    return (",
"        <div>{{Module}} Module</div>",
"    );",
"}"
)

}

function Get-NewPageTemplate {

    return @(
"export default function New{{Module}}Page() {",
"    return (",
"        <div>Create {{Module}}</div>",
"    );",
"}"
)

}

function Get-DetailsPageTemplate {

    return @(
"interface PageProps {",
"    params: Promise<{ id: string }>;",
"}",
"",
"export default async function {{Module}}DetailsPage({ params }: PageProps) {",
"",
"    const { id } = await params;",
"",
"    return (",
"        <div>{{Module}} : {id}</div>",
"    );",
"",
"}"
)

}

function Get-EditPageTemplate {

    return @(
"interface PageProps {",
"    params: Promise<{ id: string }>;",
"}",
"",
"export default async function Edit{{Module}}Page({ params }: PageProps) {",
"",
"    const { id } = await params;",
"",
"    return (",
"        <div>Edit {{Module}} : {id}</div>",
"    );",
"",
"}"
)

}

function Get-DataTableTemplate {

    return @(
"export function {{Module}}DataTable() {",
"",
"    return (",
"        <div>{{Module}} DataTable</div>",
"    );",
"",
"}"
)

}

function Get-ColumnsTemplate {

    return @(
"export const {{Module}}Columns = [",
"    {",
"        accessorKey: 'id',",
"        header: 'ID'",
"    }",
"];"
)

}

function Get-ToolbarTemplate {

    return @(
"export function {{Module}}Toolbar() {",
"",
"    return <div>{{Module}} Toolbar</div>;",
"",
"}"
)

}

function Get-FiltersTemplate {

    return @(
"export function {{Module}}Filters() {",
"",
"    return <div>{{Module}} Filters</div>;",
"",
"}"
)

}

function Get-FormTemplate {

    return @(
"export function {{Module}}Form() {",
"",
"    return <div>{{Module}} Form</div>;",
"",
"}"
)

}
