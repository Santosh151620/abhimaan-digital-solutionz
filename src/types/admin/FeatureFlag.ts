/**
 * ============================================================================
 * Feature Flags
 * ============================================================================
 */

export interface FeatureFlag {

    id: string;

    organizationId?: string;

    moduleCode: string;

    key: string;

    name: string;

    description?: string;

    enabled: boolean;

    value?: string;

    createdAt: string;

    updatedAt?: string;

}