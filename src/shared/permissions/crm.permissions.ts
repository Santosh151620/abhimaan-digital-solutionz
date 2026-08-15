/**
 * ============================================================================
 * ADS CRM PERMISSIONS
 * ============================================================================
 *
 * Canonical CRM permission catalogue.
 *
 * Permission identifiers are stable application contracts and must remain
 * aligned with the authorization/RBAC layer and persisted role assignments.
 *
 * Authorization is enforced server-side. These constants provide the
 * canonical vocabulary and compile-time/runtime-safe typing; they do not
 * replace Supabase RLS or organization isolation.
 * ============================================================================
 */

export const CRM_PERMISSIONS = [
    "leads.view",
    "leads.create",
    "leads.update",
    "leads.delete",

    "companies.view",
    "companies.create",
    "companies.update",
    "companies.delete",

    "contacts.view",
    "contacts.create",
    "contacts.update",
    "contacts.delete",

    "projects.view",
    "projects.create",
    "projects.update",
    "projects.delete",

    "activities.view",
    "activities.create",
    "activities.update",
    "activities.delete",

    "attachments.view",
    "attachments.create",
    "attachments.update",
    "attachments.delete",

    "calendar.view",
    "calendar.create",
    "calendar.update",
    "calendar.delete",

    "contracts.view",
    "contracts.create",
    "contracts.update",
    "contracts.delete",

    "invoices.view",
    "invoices.create",
    "invoices.update",
    "invoices.delete",

    "knowledge-base.view",
    "knowledge-base.create",
    "knowledge-base.update",
    "knowledge-base.delete",

    "notes.view",
    "notes.create",
    "notes.update",
    "notes.delete",

    "notifications.view",
    "notifications.create",
    "notifications.update",
    "notifications.delete",

    "opportunities.view",
    "opportunities.create",
    "opportunities.update",
    "opportunities.delete",

    "payments.view",
    "payments.create",
    "payments.update",
    "payments.delete",

    "pipeline.view",
    "pipeline.create",
    "pipeline.update",
    "pipeline.delete",

    "products.view",
    "products.create",
    "products.update",
    "products.delete",

    "quotations.view",
    "quotations.create",
    "quotations.update",
    "quotations.delete",

    "reports.view",
    "reports.create",
    "reports.update",
    "reports.delete",

    "settings.view",
    "settings.create",
    "settings.update",
    "settings.delete",

    "tasks.view",
    "tasks.create",
    "tasks.update",
    "tasks.delete",

    "tickets.view",
    "tickets.create",
    "tickets.update",
    "tickets.delete",

    "crm.export",
] as const;


/**
 * Strongly typed CRM permission identifier.
 */
export type CrmPermission =
    (typeof CRM_PERMISSIONS)[number];


/**
 * Runtime permission validation.
 *
 * Use this when a permission originates from persisted data, an API payload,
 * session state, or another untrusted string source.
 */
export function isCrmPermission(
    permission: string,
): permission is CrmPermission {

    return (
        CRM_PERMISSIONS as readonly string[]
    ).includes(
        permission,
    );

}