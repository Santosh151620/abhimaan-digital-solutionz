import {
    redirect,
} from "next/navigation";

import {
    getLocale,
} from "next-intl/server";


/**
 * ============================================================================
 * ADS CRM — ADMIN CENTER ENTRY ROUTE
 * ============================================================================
 *
 * Route:
 *
 * /[locale]/dashboard/admin
 *
 * Purpose:
 *
 * Canonical entry point for CRM organization administration.
 *
 * Redirect target:
 *
 * /[locale]/dashboard/admin/overview
 *
 * Architecture Boundary:
 *
 * /dashboard/admin
 *      |
 *      └── CRM Organization Administration
 *
 * /admin
 *      |
 *      └── ADS Platform Master Control Center
 *
 * Responsibilities:
 *
 * - Resolve active locale.
 * - Redirect to CRM Admin overview.
 *
 * Does NOT:
 *
 * - Query database.
 * - Load organization context.
 * - Execute authorization logic.
 * - Manage users, roles or permissions.
 * - Contain business rules.
 *
 * Authentication and authorization remain handled by the
 * existing application security boundary.
 *
 * ============================================================================
 */


export default async function CRMAdminEntryPage() {

    const locale =
        await getLocale()
            .catch(
                () => "en",
            );


    redirect(
        `/${locale}/dashboard/admin/overview`,
    );

}