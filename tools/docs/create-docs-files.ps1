<#
.SYNOPSIS
    Documentation Generator

.DESCRIPTION
    Generates foundational documentation from the template library.

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

    Write-Log "Starting Documentation Generator..."

    $manifest = Get-Manifest

    Test-Manifest $manifest | Out-Null
    Test-Templates $manifest | Out-Null

    $generated = 0
    $skipped = 0

    foreach ($category in $manifest.Categories) {

        $templateFile = Join-Path (Get-Location) `
            (Join-Path $manifest.Paths.TemplateRoot $manifest.Templates[$category])

        $outputFolder = Join-Path (Get-Location) `
            (Join-Path $manifest.Paths.OutputRoot $category.ToLower())

        $outputFile = Join-Path $outputFolder "README.md"

        if (-not (Test-Path $outputFolder)) {
            New-Item -ItemType Directory -Path $outputFolder -Force | Out-Null
        }

        if (Test-Path $outputFile) {

            Write-Log "Skipped: $outputFile already exists." WARNING
            $skipped++
            continue
        }

        Copy-Item `
            -Path $templateFile `
            -Destination $outputFile

        Write-Log "Generated: $outputFile" SUCCESS
        $generated++
    }

    Write-Host ""
    Write-Host "Generation Summary" -ForegroundColor Cyan
    Write-Host "------------------"
    Write-Host "Generated : $generated"
    Write-Host "Skipped   : $skipped"
    Write-Host ""

    Write-Log "Documentation generation completed successfully." SUCCESS

}
catch {

    Write-Log $_.Exception.Message ERROR
    exit 1

}