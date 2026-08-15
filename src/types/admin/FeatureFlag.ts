/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 *
 * Feature Flag
 *
 * Enterprise Feature Management Contract
 * CRM + Admin Compatible
 * Production SaaS Contract
 * ============================================================================
 *
 * Contract-only definition.
 *
 * Feature evaluation, authorization, rollout targeting and persistence belong
 * to the feature-flag service/repository/runtime layers.
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



/**
 * Feature flag lifecycle status.
 */
export type FeatureFlagStatus =
    | "Active"
    | "Inactive"
    | "Preview"
    | "Deprecated";



/**
 * Feature flag ownership/evaluation scope.
 */
export type FeatureFlagScope =
    | "Platform"
    | "Organization"
    | "Module";



/**
 * Enterprise feature-flag contract.
 */
export interface FeatureFlag
    extends BaseEntity {


    /**
     * Optional tenant ownership.
     *
     * Undefined represents a platform-level flag.
     *
     * For Organization scope, this should be present.
     */
    organizationId?: string;



    /**
     * Module associated with the feature.
     *
     * Examples:
     * CRM, Analytics, AI.
     */
    moduleCode: string;



    /**
     * Stable machine-readable feature identifier.
     */
    key: string;



    /**
     * Human-readable feature name.
     */
    name: string;



    /**
     * Optional feature description.
     */
    description?: string;



    /**
     * Feature ownership/evaluation scope.
     */
    scope: FeatureFlagScope;



    /**
     * Feature lifecycle state.
     */
    status: FeatureFlagStatus;



    /**
     * Current enabled state.
     */
    enabled: boolean;



    /**
     * Optional dynamic feature value.
     *
     * Interpretation belongs to the consuming module.
     */
    value?: string;



    /**
     * Percentage-based rollout.
     *
     * Valid range:
     * 0 - 100.
     */
    rolloutPercentage?: number;



    /**
     * Identifies platform-controlled/system flags.
     *
     * System flags require elevated administrative authority to modify.
     */
    isSystem: boolean;



    /**
     * Extensible non-sensitive metadata.
     */
    metadata?: Record<string, unknown>;



    /**
     * Audit ownership.
     */
    createdBy?: string;

    updatedBy?: string;

}