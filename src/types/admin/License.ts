/**
 * ============================================================================
 * License
 * ============================================================================
 */

export type LicenseType =
    | "Trial"
    | "CRM"
    | "ERP"
    | "CRM+ERP"
    | "Enterprise";

export interface License {

    id: string;

    organizationId: string;

    type: LicenseType;

    activatedOn: string;

    expiresOn?: string;

    maxUsers: number;

    maxStorageGb: number;

    maxOrganizations: number;

    enabledModules: string[];

    enabledFeatures: string[];

    active: boolean;

    metadata?: Record<string, unknown>;

}