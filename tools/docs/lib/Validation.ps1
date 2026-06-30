<#
.SYNOPSIS
    Validation helpers for the Documentation Engine.

.DESCRIPTION
    Validates the documentation manifest and template library.

.NOTES
    Project : Abhimaan Digital Solutionz
    Module  : Internal Developer Tooling (IDT)
    Version : 1.0.0
#>

Set-StrictMode -Version Latest

function Test-Manifest {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [hashtable]$Manifest
    )

    $requiredSections = @(
        'Metadata'
        'Paths'
        'Generator'
        'Categories'
        'Templates'
    )

    foreach ($section in $requiredSections) {
        if (-not $Manifest.ContainsKey($section)) {
            throw "Manifest is missing required section '$section'."
        }
    }

    if ($Manifest.Categories.Count -eq 0) {
        throw "Manifest does not contain any documentation categories."
    }

    if ($Manifest.Templates.Count -eq 0) {
        throw "Manifest does not contain any template mappings."
    }

    return $true
}

function Test-Templates {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [hashtable]$Manifest
    )

    $templateRoot = Join-Path (Get-Location) $Manifest.Paths.TemplateRoot

    if (-not (Test-Path $templateRoot)) {
        throw "Template directory not found: $templateRoot"
    }

    foreach ($category in $Manifest.Categories) {

        if (-not $Manifest.Templates.ContainsKey($category)) {
            throw "Template mapping missing for category '$category'."
        }

        $templateFile = Join-Path $templateRoot $Manifest.Templates[$category]

        if (-not (Test-Path $templateFile)) {
            throw "Template file not found: $templateFile"
        }
    }

    return $true
}