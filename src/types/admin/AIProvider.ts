/**
 * ============================================================================
 * AI Provider
 * ============================================================================
 */

export type AIProviderType =
    | "OpenAI"
    | "Azure OpenAI"
    | "Anthropic"
    | "Google"
    | "AWS Bedrock"
    | "Ollama"
    | "Custom";

export interface AIProvider {

    id: string;

    organizationId?: string;

    code: string;

    name: string;

    provider: AIProviderType;

    endpoint?: string;

    model: string;

    enabled: boolean;

    defaultProvider: boolean;

    supportsStreaming: boolean;

    supportsVision: boolean;

    supportsEmbeddings: boolean;

    supportsFunctions: boolean;

    configuration: Record<string, unknown>;

    createdAt: string;

    updatedAt?: string;

}