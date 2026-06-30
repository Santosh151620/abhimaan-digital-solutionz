<#
.SYNOPSIS
    Manifest helper functions for the Documentation Engine.

.DESCRIPTION
    Loads the Documentation Engine manifest and performs basic validation.

.NOTES
    Project : Abhimaan Digital Solutionz
    Module  : Internal Developer Tooling (IDT)
    Version : 1.0.0
#>

Set-StrictMode -Version Latest

function Get-Manifest {
    [CmdletBinding()]
    param(
        [string]$ManifestPath = (Join-Path $PSScriptRoot "..\manifest.psd1")
    )

    $resolvedPath = Resolve-Path -Path $ManifestPath -ErrorAction SilentlyContinue

    if (-not $resolvedPath) {
        throw "Manifest file not found: $ManifestPath"
    }

    try {
        $manifest = Import-PowerShellDataFile -Path $resolvedPath

        if (-not $manifest) {
            throw "Manifest could not be loaded."
        }

        return $manifest
    }
    catch {
        throw "Failed to load manifest. $($_.Exception.Message)"
    }
}