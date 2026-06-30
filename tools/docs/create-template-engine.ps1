<#
.SYNOPSIS
    Documentation Template Engine.

.DESCRIPTION
    Loads and validates the documentation manifest and template library,
    then builds an in-memory template catalog for downstream tooling.

.NOTES
    Project : Abhimaan Digital Solutionz
    Module  : Internal Developer Tooling (IDT)
    Version : 1.0.0
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ---------------------------------------------------------------------
# Load Helper Libraries
# ---------------------------------------------------------------------

. "$PSScriptRoot\lib\Logging.ps1"
. "$PSScriptRoot\lib\manifest-helper.ps1"
. "$PSScriptRoot\lib\Validation.ps1"

try {

    Write-Log "Starting Documentation Template Engine..."

    $manifest = Get-Manifest

    Test-Manifest $manifest | Out-Null
    Write-Log "Manifest validation passed." SUCCESS

    Test-Templates $manifest | Out-Null
    Write-Log "Template validation passed." SUCCESS

    $templateCatalog = foreach ($category in $manifest.Categories) {

        [PSCustomObject]@{
            Category = $category
            Template = $manifest.Templates[$category]
            Path     = Join-Path $manifest.Paths.TemplateRoot $manifest.Templates[$category]
        }
    }

    Write-Log "Template catalog created successfully." SUCCESS
    Write-Log "Templates discovered: $($templateCatalog.Count)"

    Write-Host ""
    Write-Host "Documentation Template Catalog" -ForegroundColor Cyan
    Write-Host "--------------------------------"

    $templateCatalog |
        Sort-Object Category |
        Format-Table -AutoSize

    Write-Host ""
    Write-Log "Template Engine completed successfully." SUCCESS

    return $templateCatalog

}
catch {

    Write-Log $_.Exception.Message ERROR
    exit 1

}