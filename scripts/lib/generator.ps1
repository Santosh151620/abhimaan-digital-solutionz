Set-StrictMode -Version Latest

function Assert-CrmModule {

    param(
        [Parameter(Mandatory = $true)]
        [string]$Module
    )

    if ([string]::IsNullOrWhiteSpace($Module)) {

        Stop-Factory "Module name is required."

    }

}

function New-CrmModule {

    param(
        [Parameter(Mandatory = $true)]
        [string]$Module
    )

    Assert-CrmModule $Module

    Write-Section ("Generating Module : " + $Module)

    New-ModuleFolders $Module

    New-ModulePages `
        -Module $Module

    New-ModuleComponents `
        -Module $Module

    New-CrudArtifacts `
        -Module $Module

    New-ApiArtifacts `
        -Module $Module

    Register-All `
        -Module $Module

    Test-GeneratedModule `
        -Module $Module

    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host " MODULE GENERATED SUCCESSFULLY" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""

}

function Update-CrmModule {

    param(
        [Parameter(Mandatory = $true)]
        [string]$Module
    )

    Assert-CrmModule $Module

    Write-Section ("Regenerating Module : " + $Module)

    New-ModuleFolders $Module

    New-ModulePages `
        -Module $Module `
        -Force

    New-ModuleComponents `
        -Module $Module `
        -Force

    New-CrudArtifacts `
        -Module $Module `
        -Force

    New-ApiArtifacts `
        -Module $Module `
        -Force

    Register-All `
        -Module $Module

    Test-GeneratedModule `
        -Module $Module

    Write-Success "Module Regenerated"

}

function Remove-CrmModule {

    param(
        [Parameter(Mandatory = $true)]
        [string]$Module
    )

    Assert-CrmModule $Module

    Write-Section ("Removing Module : " + $Module)

    $paths = Get-ModulePaths $Module

    $targets = @(
        $paths.App,
        $paths.Components,
        $paths.Api,
        $paths.Repository,
        $paths.Service,
        $paths.Types,
        $paths.Hook,
        $paths.Validation,
        $paths.Documentation,
        $paths.Test
    )

    foreach ($target in $targets) {

        if (Test-Path -LiteralPath $target) {

            Remove-Item `
                -LiteralPath $target `
                -Recurse `
                -Force

            Write-Success ("Deleted : " + $target)

        }

    }

}

function Show-CrmModules {

    $modules = Get-RegisteredModules

    Write-Host ""
    Write-Host "Registered CRM Modules"
    Write-Host "----------------------"

    foreach ($module in ($modules | Sort-Object)) {

        Write-Host (" - " + $module)

    }

    Write-Host ""

}
