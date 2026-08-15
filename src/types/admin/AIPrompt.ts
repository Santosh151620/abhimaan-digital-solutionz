/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 * AI Prompt
 * Enterprise Prompt Management Contract
 * ============================================================================
 *
 * Contract-only definition.
 *
 * Persistence, authorization, tenant isolation, version lifecycle and
 * provider-specific execution belong to their respective service/repository
 * layers.
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



/**
 * Enterprise AI prompt configuration.
 *
 * Prompts may be platform-level or organization-scoped.
 * Versioning is explicit so agents can reference a stable prompt revision
 * without coupling the contract to a specific AI provider.
 */
export interface AIPrompt
    extends BaseEntity {


    /**
     * Optional organization scope.
     *
     * Undefined may represent a platform-level/shared prompt.
     */
    organizationId?: string;



    /**
     * Stable machine-readable prompt identifier.
     */
    code: string;



    /**
     * Human-readable prompt name.
     */
    name: string;



    /**
     * Optional business/administrative description.
     */
    description?: string;



    /**
     * System-level instruction supplied to the AI provider.
     */
    systemPrompt: string;



    /**
     * User-message template supplied to the AI provider.
     */
    userPromptTemplate: string;



    /**
     * Model sampling temperature.
     *
     * Validation of provider-specific limits belongs to the AI provider
     * integration/service layer.
     */
    temperature: number;



    /**
     * Maximum requested output token count.
     */
    maxTokens: number;



    /**
     * Prompt revision number.
     */
    version: number;



    /**
     * Whether this prompt revision is available for runtime use.
     */
    active: boolean;



    /**
     * Extensible application/provider metadata.
     */
    metadata?: Record<string, unknown>;



    /**
     * Audit ownership.
     */
    createdBy?: string;

    updatedBy?: string;

}