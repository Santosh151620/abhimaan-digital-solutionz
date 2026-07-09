Set-StrictMode -Version Latest

function Assert-Module {

    param(
        [string]$Module
    )

    if ([string]::IsNullOrWhiteSpace($Module)) {

        Stop-Factory "Module name is required."

    }

    $configFile = Join-Path $Script:ScriptRoot "config.json"

    if (-not (Test-Path -LiteralPath $configFile)) {

        Stop-Factory "config.json not found."

    }

    $config = Get-Content `
        -LiteralPath $configFile `
        -Raw | ConvertFrom-Json

    if ($config.modules -notcontains $Module) {

        Stop-Factory "Unsupported CRM Module : $Module"

    }

}

function New-ModuleScaffold {

    param(
        [string]$Module
    )

    Assert-Module $Module

    Write-Section "Generating Module : $Module"

    New-ModuleFolders $Module

    Write-Success "Folder Structure Ready"

}

function New-ModulePages {

    param(
        [string]$Module
    )

    $ctx = Get-ModuleContext $Module

    $paths = Get-ModulePaths $Module

    Write-Template `
        -Path (Join-Path $paths.App "page.tsx") `
        -Template (Get-PageTemplate) `
        -Context $ctx

    Write-Template `
        -Path (Join-Path $paths.App "new\page.tsx") `
        -Template (Get-NewPageTemplate) `
        -Context $ctx

    Write-Template `
        -Path (Join-Path $paths.App "[id]\page.tsx") `
        -Template (Get-DetailsPageTemplate) `
        -Context $ctx

    Write-Template `
        -Path (Join-Path $paths.App "[id]\edit\page.tsx") `
        -Template (Get-EditPageTemplate) `
        -Context $ctx

    Write-Success "Pages Generated"

}

function New-ComponentScaffold {

    param(
        [string]$Module
    )

    $ctx = Get-ModuleContext $Module

    Write-Template `
        -Path (Get-ModuleFile $Module "DataTable") `
        -Template (Get-DataTableTemplate) `
        -Context $ctx

    Write-Template `
        -Path (Get-ModuleFile $Module "Columns") `
        -Template (Get-ColumnsTemplate) `
        -Context $ctx

    Write-Template `
        -Path (Get-ModuleFile $Module "Toolbar") `
        -Template (Get-ToolbarTemplate) `
        -Context $ctx

    Write-Template `
        -Path (Get-ModuleFile $Module "Filters") `
        -Template (Get-FiltersTemplate) `
        -Context $ctx

    Write-Template `
        -Path (Get-ModuleFile $Module "Form") `
        -Template (Get-FormTemplate) `
        -Context $ctx

    Write-Success "Components Generated"

}

function New-Module {

    param(
        [string]$Module
    )

    Assert-Module $Module

    Write-Section "CRM MODULE FACTORY"

    New-ModuleScaffold $Module

    New-ModulePages $Module

    New-ComponentScaffold $Module

    New-CrudArtifacts $Module

    New-ApiArtifacts $Module

    Register-CrmModule $Module

    Test-GeneratedModule $Module

    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host " MODULE GENERATED SUCCESSFULLY" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""

}