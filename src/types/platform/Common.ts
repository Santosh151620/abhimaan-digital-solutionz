/**
 * ============================================================================
 * Shared Platform Types
 * ============================================================================
 */

export type RecordStatus =
    | "Active"
    | "Inactive"
    | "Archived"
    | "Deleted";

export type Visibility =
    | "Private"
    | "Organization"
    | "Public";

export type Severity =
    | "Info"
    | "Warning"
    | "Error"
    | "Critical";

export type Environment =
    | "Development"
    | "Testing"
    | "Staging"
    | "Production";