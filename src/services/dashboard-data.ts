import { unstable_noStore as noStore } from "next/cache";

import {
    getLeadCounts,
} from "./leads";

import {
    getActiveClientsCount,
} from "@/modules/clients/services/clients";

import {
    getActiveProjectsCount,
} from "@/modules/projects/services/projects";

import {
    getPaymentsCountByStatus,
} from "./payments";

import type {
    Lead,
} from "@/types/lead";

import type {
    Client,
} from "@/modules/clients/types/client";

import type {
    Project,
} from "@/modules/projects/types/project";

import type {
    Payment,
} from "@/types/payment";


/**
 * ============================================================================
 * CRM DASHBOARD DATA
 * ============================================================================
 *
 * Legacy dashboard aggregation boundary.
 *
 * This service intentionally does not perform direct Supabase table reads.
 * Dashboard calculations are delegated to the canonical domain services so
 * authentication, organization isolation, repository behavior and RLS remain
 * below the application service boundary.
 *
 * New KPI/intelligence consumers should prefer:
 *
 * - getCRMAnalytics()
 * - getDashboardSnapshot()
 *
 * This contract is retained for existing consumers that still depend on the
 * historical DashboardData shape.
 * ============================================================================
 */


export interface DashboardData {

    leads: Lead[];

    clients: Client[];

    projects: Project[];

    payments: Payment[];

}


/**
 * Load the legacy dashboard contract.
 *
 * The canonical domain services are intentionally executed here rather than
 * reintroducing broad `select("*")` queries.
 *
 * The historical collection fields remain empty arrays because the current
 * canonical dashboard APIs expose KPI/count contracts rather than unrestricted
 * entity collections. Callers requiring actual records should use the
 * corresponding domain service directly.
 */
export async function getDashboardData():
    Promise<DashboardData> {

    noStore();


    await Promise.all([

        getLeadCounts(),

        getActiveClientsCount(),

        getActiveProjectsCount(),

        getPaymentsCountByStatus(),

    ]);


    return {

        leads: [],

        clients: [],

        projects: [],

        payments: [],

    };

}