/**
 * ============================================================================
 * Feature Flag
 * Enterprise Feature Management
 * CRM + ERP Compatible
 * Production Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type FeatureFlagType =
    | "Boolean"
    | "Configuration"
    | "Experiment"
    | "Rollout";


export type FeatureFlagScope =
    | "System"
    | "Organization"
    | "User";


export interface FeatureFlag extends BaseEntity {

    /**
     * Optional organization override.
     * System flags remain platform controlled.
     */
    organizationId?: string;


    /**
     * Module ownership.
     */
    moduleCode: string;


    key: string;


    name: string;


    description?: string;


    type: FeatureFlagType;


    scope: FeatureFlagScope;


    enabled: boolean;


    /**
     * Optional dynamic value.
     * Supports configuration based flags.
     */
    value?: string;


    rolloutPercentage?: number;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}