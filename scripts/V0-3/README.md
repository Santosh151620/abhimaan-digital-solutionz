# V0-3 CRM Module Factory

## Purpose

Single reusable CRM module generator.

## Supported Modules

- Companies
- Contacts
- Opportunities
- Tasks
- Calendar
- Activities
- Quotes
- Invoices

## Usage

```powershell
.\scripts\V0-3\run-create-crm-module.ps1 Companies
```

## Output

Creates:

- App Route
- Components
- Services
- Repository
- Hooks
- Types
- Documentation

## Notes

- Windows PowerShell 5.1 compatible
- Idempotent folder creation
- Single factory for all CRM modules
- Designed for Hybrid SaaS and On-Prem deployments