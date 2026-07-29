#Requires -Version 5.1

<#
==============================================================================
Abhimaan Digital Solutionz
Enterprise Migration Generator

Purpose
-------
Generates the complete Enterprise Migration Pack
(001-040)

Author:
ADS Platform

Compatibility:
PowerShell 5.1

Supported
----------
Supabase
PostgreSQL 15+
Next.js Platform
CRM
Admin
Website CMS
Future ERP

Principles
----------
• Idempotent
• Preserve Existing Work
• Enterprise Grade
• SaaS Ready
• On-Prem Ready
• Zero Manual Editing
• Repeatable
==============================================================================#
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ScriptRoot = Split-Path $MyInvocation.MyCommand.Path -Parent
$ProjectRoot = Resolve-Path "$ScriptRoot\.."

$MigrationFolder =
    Join-Path `
        $ProjectRoot `
        "supabase\migrations"

$BlueprintFile =
    Join-Path `
        $ScriptRoot `
        "migration-blueprint.json"

$TemplateFolder =
    Join-Path `
        $ScriptRoot `
        "sql-templates"

Write-Host ""
Write-Host "============================================="
Write-Host " ADS Enterprise Migration Generator"
Write-Host "============================================="
Write-Host ""

if (!(Test-Path $MigrationFolder)) {

    throw "Migration folder not found."

}

if (!(Test-Path $BlueprintFile)) {

    throw "migration-blueprint.json not found."

}

if (!(Test-Path $TemplateFolder)) {

    throw "sql-templates folder not found."

}

$Blueprint =
    Get-Content `
        $BlueprintFile `
        -Raw |
    ConvertFrom-Json

function Get-Template {

    param(

        [Parameter(Mandatory)]
        [string]$Name

    )

    $File =
        Join-Path `
            $TemplateFolder `
            "$Name.sql"

    if (!(Test-Path $File)) {

        throw "$Name template missing."

    }

    Get-Content `
        $File `
        -Raw

}

function Write-Migration {

    param(

        [Parameter(Mandatory)]
        [string]$Number,

        [Parameter(Mandatory)]
        [string]$Name,

        [Parameter(Mandatory)]
        [string]$Content

    )

    $FileName =
        "{0}_{1}.sql" -f `
            $Number,
            $Name

    $Target =
        Join-Path `
            $MigrationFolder `
            $FileName

    $Header =
        Get-Template `
            "header"

    $Footer =
        Get-Template `
            "footer"

    $Output = @()

    $Output += $Header
    $Output += ""
    $Output += $Content
    $Output += ""
    $Output += $Footer

    Set-Content `
        -Path $Target `
        -Value $Output `
        -Encoding UTF8

    Write-Host ("Generated : {0}" -f $FileName)

}

function Read-Section {

    param(

        [Parameter(Mandatory)]
        [string]$Section

    )

    if ($Blueprint.PSObject.Properties.Name `
        -notcontains $Section) {

        throw "$Section not defined."

    }

    return $Blueprint.$Section

}

Write-Host ""
Write-Host "Blueprint Loaded"
Write-Host ""

Write-Host "Migration Folder :"
Write-Host $MigrationFolder

Write-Host ""

Write-Host "Template Folder :"
Write-Host $TemplateFolder

Write-Host ""

Write-Host "Ready..."
