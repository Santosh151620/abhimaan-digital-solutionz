/**
 * ============================================================================
 * Feature Flag
 * Enterprise Feature Management Contract
 * CRM + Admin Compatible
 * Production SaaS Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type FeatureFlagStatus =
    | "Active"
    | "Inactive"
    | "Preview"
    | "Deprecated";


export type FeatureFlagScope =
    | "Platform"
    | "Organization"
    | "Module";


export interface FeatureFlag extends BaseEntity {

    /**
     * Optional tenant ownership.
     * Undefined means platform level feature.
     */
    organizationId?: string;


    /**
     * Module ownership.
     * Example:
     * CRM, Analytics, AI
     */
    moduleCode: string;


    /**
     * Unique feature identifier.
     */
    key: string;


    /**
     * Display name.
     */
    name: string;


    description?: string;


    scope: FeatureFlagScope;


    status: FeatureFlagStatus;


    /**
     * Feature enabled state.
     */
    enabled: boolean;


    /**
     * Optional dynamic value.
     */
    value?: string;


    /**
     * Percentage rollout support.
     * Example:
     * 25 = enable for 25% users.
     */
    rolloutPercentage?: number;


    /**
     * Protect platform controlled flags.
     */
    isSystem: boolean;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}
