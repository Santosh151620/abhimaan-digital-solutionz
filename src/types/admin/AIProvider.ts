/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 * AI Provider
 * Enterprise AI Infrastructure Contract
 * CRM + ERP Compatible
 * ============================================================================
 *
 * Contract-only definition.
 *
 * Provider credentials, secret storage, tenant authorization, health checks
 * and provider execution belong to the infrastructure/service layers.
 *
 * IMPORTANT:
 * `configuration` must never contain plaintext API keys, access tokens,
 * client secrets or other sensitive credentials.
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



/**
 * Supported AI provider families.
 */
export type AIProviderType =
    | "OpenAI"
    | "Azure OpenAI"
    | "Anthropic"
    | "Google"
    | "AWS Bedrock"
    | "Ollama"
    | "Custom";



/**
 * Provider lifecycle/operational status.
 */
export type AIProviderStatus =
    | "Active"
    | "Inactive"
    | "Testing"
    | "Deprecated";



/**
 * Enterprise AI provider configuration.
 *
 * Providers may be platform-level or organization-scoped.
 */
export interface AIProvider
    extends BaseEntity {


    /**
     * Optional organization scope.
     *
     * Undefined may represent a platform-level provider.
     */
    organizationId?: string;



    /**
     * Stable machine-readable provider identifier.
     */
    code: string;



    /**
     * Human-readable provider name.
     */
    name: string;



    /**
     * Provider family.
     */
    provider: AIProviderType;



    /**
     * Operational lifecycle status.
     */
    status?: AIProviderStatus;



    /**
     * Optional provider endpoint.
     *
     * Required for providers/configurations that use a custom endpoint.
     */
    endpoint?: string;



    /**
     * Default model used by this provider configuration.
     */
    model: string;



    /**
     * Runtime enablement flag.
     */
    enabled: boolean;



    /**
     * Whether this provider is the default provider for its applicable scope.
     *
     * Runtime selection must still enforce authorization and availability.
     */
    defaultProvider: boolean;



    /**
     * Provider supports token/chunk streaming.
     */
    supportsStreaming: boolean;



    /**
     * Provider/model supports image/vision input.
     */
    supportsVision: boolean;



    /**
     * Provider/model supports embedding generation.
     */
    supportsEmbeddings: boolean;



    /**
     * Provider/model supports function/tool calling.
     */
    supportsFunctions: boolean;



    /**
     * Non-secret provider configuration.
     *
     * NEVER store API keys, access tokens, passwords, private keys or other
     * credentials in this object.
     */
    configuration: Record<string, unknown>;



    /**
     * Extensible provider/application metadata.
     */
    metadata?: Record<string, unknown>;



    /**
     * Audit ownership.
     */
    createdBy?: string;

    updatedBy?: string;

}