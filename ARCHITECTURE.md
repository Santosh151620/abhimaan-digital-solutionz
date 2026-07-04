# ABHIMAAN DIGITAL SOLUTIONZ
# PLATFORM ARCHITECTURE (LOCKED)

Version: 1.0

Status: LOCKED

Last Updated: July 2026

---

# PURPOSE

This document defines the permanent architecture of the Abhimaan Digital Solutionz SaaS Platform.

Once approved, these rules become the standard for all future development.

Architecture changes are prohibited unless a critical business requirement cannot be achieved.

---

# CORE PRINCIPLES

The platform must always remain:

- Scalable
- Modular
- Lightweight
- Easy to maintain
- Backend independent
- Multi-tenant
- Enterprise ready

Business capability must never be reduced for the sake of cleaner code.

---

# PLATFORM GOAL

The platform is designed to support:

- Website
- CRM
- Admin Portal
- Client Portal
- HR
- Payroll
- Inventory
- Marketing
- Helpdesk
- AI
- Automation

without future architectural redesign.

---

# ARCHITECTURE

```
Pages
    ↓
Components
    ↓
React Query Hooks
    ↓
Repositories
    ↓
API Client
    ↓
Backend
```

No layer may bypass another layer.

---

# DATA ACCESS RULES

Components MUST NEVER:

- call fetch()
- call Supabase
- call database
- call Backend directly

Hooks MUST NEVER:

- call fetch()
- call API Client
- call Supabase

Repositories are the ONLY data access layer.

Repositories communicate with API.

API communicates with Backend.

---

# MULTI TENANCY

Permanent tenant identity:

organizationId

The following are permanently prohibited:

tenantId

tenant_id

x-tenant-id

All business data belongs to:

Organization

↓

Clients

↓

Projects

↓

Invoices

↓

Employees

↓

Future Modules

---

# REPOSITORY RULES

Every business module must contain:

Repository

Optional Mapper

React Query Hooks

API Client

Repositories own:

CRUD

Caching strategy

Normalization

Backend abstraction

---

# API RULES

API layer must:

Contain HTTP communication only.

No business logic.

No UI logic.

No React logic.

---

# COMPONENT RULES

Components are presentation only.

Business logic belongs elsewhere.

Components may consume:

Hooks

Utility Functions

Types

Nothing else.

---

# SERVICES

Services exist only for:

Business workflows

Analytics

AI

Automation

Forecasting

Cross-module orchestration

Services must NEVER become CRUD wrappers.

CRUD belongs inside Repositories.

---

# MODULE STRUCTURE

Every future module should follow:

modules/

module-name/

api/

components/

hooks/

repositories/

services/

types/

utils/

mappers/

---

# FOLDER OWNERSHIP

api/

HTTP communication

repositories/

Data access

hooks/

React Query

components/

UI

services/

Business workflows

modules/

Business domains

lib/

Shared infrastructure

types/

Shared types

mappers/

Data transformation

---

# NAMING

Repository

ProjectRepository

ClientRepository

LeadRepository

Hook

useProjects

useClients

useInvoices

API

ProjectsAPI

ClientsAPI

Mapper

ProjectMapper

LeadMapper

---

# DELETE POLICY

A file may be deleted only if:

It has no business value.

It has no future roadmap value.

It has been fully replaced.

It passes lint.

It passes TypeScript.

Git history preserves recovery.

Never delete architecture.

Never delete future modules.

Never delete platform infrastructure.

---

# QUALITY GATE

Every meaningful change requires:

npm run lint

npx tsc --noEmit

npm run lint:all

before Git commit.

---

# GIT CHECKPOINT

Every completed phase ends with:

git add .

git commit -m "<Phase Name>"

---

# DEFINITION OF DONE

A feature is complete only when:

Architecture respected

Repository used

React Query used

No duplicated logic

Lint passes

TypeScript passes

Production ready

Git committed

---

# ARCHITECTURE STATUS

LOCKED

Future development focuses on business features, not architecture redesign.