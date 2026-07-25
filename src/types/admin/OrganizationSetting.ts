/**
 * ============================================================================
 * Organization Settings
 * ============================================================================
 */

export interface OrganizationSetting {

    id: string;

    organizationId: string;

    category: string;

    key: string;

    value: string;

    inherited: boolean;

    locked: boolean;

    createdAt: string;

    updatedAt?: string;

}