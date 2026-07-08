$ErrorActionPreference = "Stop"

. "$PSScriptRoot\common.ps1"

$ProjectRoot = Get-ProjectRoot

Write-Section "Abhimaan CRM Platform Foundation V0-1"

# ------------------------------------------------------------------
# Documentation Folders
# ------------------------------------------------------------------

$DocFolders = @(
    "docs",
    "docs\Modules"
)

foreach ($Folder in $DocFolders) {
    Ensure-Folder (Join-Path $ProjectRoot $Folder)
}

# ------------------------------------------------------------------
# Platform Folders
# ------------------------------------------------------------------

$PlatformFolders = @(
    "src\platform",
    "src\platform\core",
    "src\platform\configuration",
    "src\platform\deployment",
    "src\platform\tenant",
    "src\platform\organization",
    "src\platform\subscription",
    "src\platform\licensing",
    "src\platform\features",
    "src\platform\shared",
    "src\platform\services",
    "src\platform\repositories",
    "src\platform\hooks",
    "src\platform\types",
    "src\platform\utils"
)

foreach ($Folder in $PlatformFolders) {

    $FullPath = Join-Path $ProjectRoot $Folder

    Ensure-Folder $FullPath

    Write-Readme `
        -Folder $FullPath `
        -Title (Split-Path $Folder -Leaf)

}

# ------------------------------------------------------------------
# Documentation Files
# ------------------------------------------------------------------

$MarkdownFiles = @(
    "docs\Product Guide.md",
    "docs\Developer Guide.md",
    "docs\Administrator Guide.md",
    "docs\Sales Guide.md",
    "docs\Knowledge Base.md",
    "docs\Architecture.md",
    "docs\Release Notes.md"
)

foreach ($File in $MarkdownFiles) {

    Write-Markdown `
        -Path (Join-Path $ProjectRoot $File) `
        -Title ([System.IO.Path]::GetFileNameWithoutExtension($File))

}

# ------------------------------------------------------------------
# Platform Bootstrap Files
# ------------------------------------------------------------------

$TsFiles = @(
    "src\platform\index.ts",
    "src\platform\core\index.ts",
    "src\platform\configuration\index.ts",
    "src\platform\deployment\index.ts",
    "src\platform\tenant\index.ts",
    "src\platform\organization\index.ts",
    "src\platform\subscription\index.ts",
    "src\platform\licensing\index.ts",
    "src\platform\features\index.ts",
    "src\platform\shared\index.ts",
    "src\platform\services\index.ts",
    "src\platform\repositories\index.ts",
    "src\platform\hooks\index.ts",
    "src\platform\types\index.ts",
    "src\platform\utils\index.ts"
)

foreach ($File in $TsFiles) {

    Write-TypescriptFile `
        -Path (Join-Path $ProjectRoot $File)

}

Write-Host ""
Write-Host "========================================"
Write-Host "Platform Foundation Completed"
Write-Host "========================================"
Write-Host ""
# ------------------------------------------------------------------
# Product Documentation
# V0-2
# ------------------------------------------------------------------

Write-Section "Generating Product Documentation"

$Documents = @(
    @{
        File = "docs\Product Guide.md"
        Title = "Abhimaan Digital Solutionz CRM Product Guide"
        Content = @"
# Abhimaan Digital Solutionz CRM

## Version

V0.2

## Product Vision

Enterprise-ready CRM platform supporting both SaaS and On-Premise deployments.

## Deployment Models

- SaaS
- On-Premise
- Hybrid

## Core Platform

- Dashboard
- Executive Dashboard
- AI Dashboard
- Business Intelligence
- Executive Intelligence
- Command Palette

## CRM Roadmap

- Leads
- Companies
- Contacts
- Opportunities
- Tasks
- Calendar
- Activities
- Quotes
- Invoices
- Customer Portal

## Future

- AI
- Automation
- Reports
- RBAC
- Audit
- Integrations
- APIs

"@
    },
    @{
        File = "docs\Knowledge Base.md"
        Title = "Knowledge Base"
        Content = @"
# Knowledge Base

This document is the central knowledge repository for the CRM platform.

## Sections

- Platform
- Dashboard
- AI
- CRM
- Modules
- Automation
- Deployment
- Security
- Documentation

This document will continuously evolve during development.

"@
    },
    @{
        File = "docs\Developer Guide.md"
        Title = "Developer Guide"
        Content = @"
# Developer Guide

## Technology

- Next.js
- React
- TypeScript
- TailwindCSS

## Principles

- Modular
- Reusable
- Automation First
- Script Driven
- Zero Regression

"@
    },
    @{
        File = "docs\Administrator Guide.md"
        Title = "Administrator Guide"
        Content = @"
# Administrator Guide

## Responsibilities

- Tenant Administration
- Organization Management
- User Management
- Roles
- Permissions
- Monitoring
- Backup
- Restore

"@
    },
    @{
        File = "docs\Sales Guide.md"
        Title = "Sales Guide"
        Content = @"
# Sales Guide

## Target Customers

- Small Business
- Mid-size Business
- Enterprise

## Deployment

- SaaS
- On-Premise
- Hybrid

## Key Selling Points

- Executive Dashboards
- AI
- Automation
- CRM
- Modular Platform

"@
    },
    @{
        File = "docs\Architecture.md"
        Title = "Architecture"
        Content = @"
# Architecture

## Layers

Presentation

Business

CRM

Platform

Infrastructure

Documentation

Automation

Hybrid Deployment Ready

"@
    }
)

foreach ($Document in $Documents) {

    $FullPath = Join-Path $ProjectRoot $Document.File

    Set-Content `
        -LiteralPath $FullPath `
        -Value $Document.Content `
        -Encoding UTF8

    Write-Host "[DOC] $($Document.File)"

}