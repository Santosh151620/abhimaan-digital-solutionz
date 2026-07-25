/**
 * ============================================================================
 * Module Registry
 * ============================================================================
 */

export type ModuleCategory =
    | 'Platform'
    | 'CRM'
    | 'ERP'
    | 'Shared';

export type ModuleStatus =
    | 'Enabled'
    | 'Disabled';

export interface PlatformModule {

    id: string;

    code: string;

    name: string;

    description?: string;

    category: ModuleCategory;

    version: string;

    route: string;

    icon?: string;

    sortOrder: number;

    enabled: boolean;

    status: ModuleStatus;

    dependencies: string[];

}

export interface OrganizationModule {

    organizationId: string;

    moduleId: string;

    enabled: boolean;

    enabledAt?: string;

    enabledBy?: string;

}