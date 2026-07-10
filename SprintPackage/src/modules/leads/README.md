# Leads Module (Entity-Driven CRM)

## Status
Fully migrated to entity-driven architecture.

## Core Principle
All data is strictly governed by:

- entityType: "lead"
- entityId: string

No legacy IDs are used.

## Layers

### 1. Repository Layer
Supabase-backed BaseRepository implementation.

### 2. Service Layer
Business logic abstraction over repository.

### 3. API Layer
Next.js route handlers.

### 4. UI Layer
Reusable React components.

### 5. Integration Layer
Bridges to:
- Activity system
- Notes system
- Dashboard aggregation
- Search indexing
- Sync engine

## Entity Contract

```ts
{
  entityType: "lead",
  entityId: string
}