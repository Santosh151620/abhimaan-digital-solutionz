Set-StrictMode -Version Latest

function Get-ProjectPaths {

    return @{

        Root = $Script:ProjectRoot
        App = Join-Path $Script:ProjectRoot "src\app"
        Components = Join-Path $Script:ProjectRoot "src\components"
        Services = Join-Path $Script:ProjectRoot "src\services"
        Repositories = Join-Path $Script:ProjectRoot "src\repositories"
        Hooks = Join-Path $Script:ProjectRoot "src\hooks"
        Types = Join-Path $Script:ProjectRoot "src\types"
        Validation = Join-Path $Script:ProjectRoot "src\lib\validation"
        Config = Join-Path $Script:ProjectRoot "src\config"
        Docs = Join-Path $Script:ProjectRoot "docs"
        Tests = Join-Path $Script:ProjectRoot "tests"

    }

}

function Get-ModulePaths {

    param(
        [string]$Module
    )

    $project = Get-ProjectPaths
    $route = $Module.ToLower()

    return @{

        Module = $Module
        Route = $route

        App = Join-Path $project.App ("crm\" + $route)
        Components = Join-Path $project.Components ("crm\" + $route)
        Api = Join-Path $project.App ("api\crm\" + $route)

        Repository = Join-Path $project.Repositories ("crm\" + $Module + "Repository.ts")
        Service = Join-Path $project.Services ("crm\" + $Module + "Service.ts")
        Types = Join-Path $project.Types ("crm\" + $Module + ".ts")
        Hook = Join-Path $project.Hooks ("crm\use" + $Module + ".ts")
        Validation = Join-Path $project.Validation ($Module + "Schema.ts")

        Documentation = Join-Path $project.Docs ("crm\modules\" + $Module + ".md")
        Test = Join-Path $project.Tests ("crm\" + $Module + ".test.ts")

    }

}

function Get-ModuleFile {

    param(

        [string]$Module,

        [string]$Artifact

    )

    $paths = Get-ModulePaths $Module

    switch ($Artifact) {

        "Page" { return (Join-Path $paths.App "page.tsx") }

        "NewPage" { return (Join-Path $paths.App "new\page.tsx") }

        "DetailsPage" { return (Join-Path $paths.App "[id]\page.tsx") }

        "EditPage" { return (Join-Path $paths.App "[id]\edit\page.tsx") }

        "Actions" { return (Join-Path $paths.App "actions.ts") }

        "DataTable" { return (Join-Path $paths.Components ($Module + "DataTable.tsx")) }

        "Columns" { return (Join-Path $paths.Components ($Module + "Columns.ts")) }

        "Toolbar" { return (Join-Path $paths.Components ($Module + "Toolbar.tsx")) }

        "Filters" { return (Join-Path $paths.Components ($Module + "Filters.tsx")) }

        "Form" { return (Join-Path $paths.Components ($Module + "Form.tsx")) }

        "Barrel" { return (Join-Path $paths.Components "index.ts") }

        "Repository" { return $paths.Repository }

        "Service" { return $paths.Service }

        "Type" { return $paths.Types }

        "Hook" { return $paths.Hook }

        "Validation" { return $paths.Validation }

        "Api" { return (Join-Path $paths.Api "route.ts") }

        "ApiItem" { return (Join-Path $paths.Api "[id]\route.ts") }

        "Documentation" { return $paths.Documentation }

        "Test" { return $paths.Test }

        default {

            Stop-Factory ("Unknown Artifact : " + $Artifact)

        }

    }

}

function New-ModuleFolders {

    param(
        [string]$Module
    )

    $paths = Get-ModulePaths $Module

    @(
        $paths.App,
        (Join-Path $paths.App "new"),
        (Join-Path $paths.App "[id]"),
        (Join-Path $paths.App "[id]\edit"),
        $paths.Components,
        $paths.Api,
        (Join-Path $paths.Api "[id]"),
        (Split-Path $paths.Repository -Parent),
        (Split-Path $paths.Service -Parent),
        (Split-Path $paths.Types -Parent),
        (Split-Path $paths.Hook -Parent),
        (Split-Path $paths.Validation -Parent),
        (Split-Path $paths.Documentation -Parent),
        (Split-Path $paths.Test -Parent)
    ) | ForEach-Object {

        Ensure-Folder $_

    }

    Write-Success "Folder Structure Ready"

}

function New-ModulePages {

    param(

        [string]$Module,

        [switch]$Force

    )

    $ctx = Get-ModuleContext $Module

    Write-Template (Get-ModuleFile $Module "Page") (Get-PageTemplate) $ctx -Force:$Force

    Write-Template (Get-ModuleFile $Module "NewPage") (Get-NewPageTemplate) $ctx -Force:$Force

    Write-Template (Get-ModuleFile $Module "DetailsPage") (Get-DetailsPageTemplate) $ctx -Force:$Force

    Write-Template (Get-ModuleFile $Module "EditPage") (Get-EditPageTemplate) $ctx -Force:$Force

    Write-Success "Pages Generated"

}

function New-ModuleComponents {

    param(

        [string]$Module,

        [switch]$Force

    )

    $ctx = Get-ModuleContext $Module

    Write-Template (Get-ModuleFile $Module "DataTable") (Get-DataTableTemplate) $ctx -Force:$Force

    Write-Template (Get-ModuleFile $Module "Columns") (Get-ColumnsTemplate) $ctx -Force:$Force

    Write-Template (Get-ModuleFile $Module "Toolbar") (Get-ToolbarTemplate) $ctx -Force:$Force

    Write-Template (Get-ModuleFile $Module "Filters") (Get-FiltersTemplate) $ctx -Force:$Force

    Write-Template (Get-ModuleFile $Module "Form") (Get-FormTemplate) $ctx -Force:$Force

    Write-Template (Get-ModuleFile $Module "Barrel") (Get-BarrelTemplate) $ctx -Force:$Force

    Write-Success "Components Generated"

}

