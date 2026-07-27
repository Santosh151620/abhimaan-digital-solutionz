/**
 * ============================================================================
 * Organization Settings
 * Enterprise Tenant Configuration
 * CRM + ERP Compatible
 * Production Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export interface OrganizationSetting extends BaseEntity {

    organizationId: string;


    category: string;


    key: string;


    value: string;


    inherited: boolean;


    locked: boolean;


    /**
     * Allows organization level override
     * of system defaults.
     */
    overrideSource?: string;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}
