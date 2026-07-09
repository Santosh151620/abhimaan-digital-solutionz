[CmdletBinding()]
param(

    [Parameter(Mandatory = $true, Position = 0)]
    [ValidateSet(
        "create",
        "verify",
        "doctor",
        "clean",
        "sync"
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

        New-Module $Module
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

    "clean" {

        Invoke-Clean
        break

    }

    "sync" {

        Invoke-Sync
        break

    }

}

Write-Host ""
Write-Host "==============================================" -ForegroundColor Green
Write-Host " CRM FACTORY COMPLETED" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""