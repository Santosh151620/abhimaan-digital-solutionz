[CmdletBinding()]
param(

    [Parameter(Mandatory = $true, Position = 0)]
   [ValidateSet(
    "create",
    "regenerate",
    "delete",
    "list",
    "verify",
    "doctor",
    "clean",
    "sync",

    "build",
    "cleanup",
    "audit",
    "dbpush",
    "migration",
    "reports"
)]
    [string]$Command,

    [Parameter(Position = 1)]
    [string]$Module = ""

)

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

. (Join-Path $scriptRoot "common.ps1")
. (Join-Path $scriptRoot "lib\filesystem.ps1")
. (Join-Path $scriptRoot "lib\templates.ps1")
. (Join-Path $scriptRoot "lib\crud.ps1")
. (Join-Path $scriptRoot "lib\api.ps1")
. (Join-Path $scriptRoot "lib\registry.ps1")
. (Join-Path $scriptRoot "lib\verify.ps1")
. (Join-Path $scriptRoot "lib\generator.ps1")

switch ($Command) {

    "create" {

        if ([string]::IsNullOrWhiteSpace($Module)) {
            Stop-Factory "Module name is required."
        }

        New-CrmModule $Module
        break
    }

    "regenerate" {

        if ([string]::IsNullOrWhiteSpace($Module)) {
            Stop-Factory "Module name is required."
        }

        Update-CrmModule $Module
        break
    }

    "delete" {

        if ([string]::IsNullOrWhiteSpace($Module)) {
            Stop-Factory "Module name is required."
        }

        Remove-CrmModule $Module
        break
    }

    "list" {

        Show-CrmModules
        break
    }

    "verify" {

        if ([string]::IsNullOrWhiteSpace($Module)) {
            Stop-Factory "Module name is required."
        }

        Invoke-Verify $Module
        break
    }

    "doctor" {

        Invoke-Doctor
        break
    }

    "clean" {

        Invoke-Clean
        break
    }

    "sync" {

        Invoke-Sync
        break
    }
"build" {
    & (Join-Path $scriptRoot "build.ps1")
    break
}

"cleanup" {
    & (Join-Path $scriptRoot "refactor.ps1")
    break
}

"audit" {
    & (Join-Path $scriptRoot "verify.ps1")
    break
}

"dbpush" {
    & (Join-Path $scriptRoot "db.ps1") push
    break
}

"migration" {

    if ([string]::IsNullOrWhiteSpace($Module)) {
        Stop-Factory "Migration name is required."
    }

    & (Join-Path $scriptRoot "db.ps1") migration $Module
    break
}

"reports" {
    & (Join-Path $scriptRoot "modules\reports.ps1")
    break
}
}

Write-Host ""
Write-Host "==============================================" -ForegroundColor Green
Write-Host " CRM FACTORY COMPLETED" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""
