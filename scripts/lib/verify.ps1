Set-StrictMode -Version Latest

function Invoke-Doctor {

    Write-Section "CRM FACTORY DOCTOR"

    Write-Host ("Factory Version : " + $Script:FactoryVersion)
    Write-Host ("Project Root    : " + $Script:ProjectRoot)
    Write-Host ("Script Root     : " + $Script:ScriptRoot)
    Write-Host ""

    $required = @(
        "common.ps1",
        "crm.ps1",
        "docs.ps1",
        "build.ps1",
        "config.json",
        "lib\filesystem.ps1",
        "lib\templates.ps1",
        "lib\generator.ps1",
        "lib\crud.ps1",
        "lib\api.ps1",
        "lib\registry.ps1",
        "lib\verify.ps1"
    )

    foreach ($item in $required) {

        $path = Join-Path $Script:ScriptRoot $item

        if (Test-Path -LiteralPath $path) {

            Write-Success $item

        }
        else {

            Stop-Factory ("Missing : " + $item)

        }

    }

}

function Invoke-Verify {

    param(
        [Parameter(Mandatory = $true)]
        [string]$Module
    )

    Test-GeneratedModule $Module

}

function Test-GeneratedModule {

    param(
        [Parameter(Mandatory = $true)]
        [string]$Module
    )

    Write-Section "Verifying Generated Module"

    $artifacts = @(
        "Page",
        "Actions",
        "Repository",
        "Service",
        "Hook",
        "Type",
        "Validation",
        "DataTable",
        "Columns",
        "Toolbar",
        "Filters",
        "Form",
        "Api",
        "ApiItem",
        "Documentation",
        "Test",
        "Barrel"
    )

    foreach ($artifact in $artifacts) {

        $path = Get-ModuleFile $Module $artifact

        if (Test-Path -LiteralPath $path) {

            Write-Success $artifact

        }
        else {

            Stop-Factory ($artifact + " Missing")

        }

    }

    Write-Success "Verification Passed"

}

function Invoke-Clean {

    Write-Section "Factory Cleanup"

    $generated = Join-Path $Script:ProjectRoot "src\config\crm"

    if (Test-Path -LiteralPath $generated) {

        Get-ChildItem `
            -LiteralPath $generated `
            -Filter "*.generated.ts" |
        Remove-Item -Force

        Write-Success "Generated registry files removed"

    }
    else {

        Write-WarningMessage "Nothing to clean"

    }

}

function Invoke-Sync {

    Write-Section "Factory Sync"

    $modules = Get-RegisteredModules

    foreach ($module in $modules) {

        Test-GeneratedModule $module

    }

    Write-Success "Factory Sync Complete"

}