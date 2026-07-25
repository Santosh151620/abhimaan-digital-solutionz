/**
 * ============================================================================
 * AI Provider
 * Enterprise AI Infrastructure Contract
 * CRM + ERP Compatible
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type AIProviderType =
    | "OpenAI"
    | "Azure OpenAI"
    | "Anthropic"
    | "Google"
    | "AWS Bedrock"
    | "Ollama"
    | "Custom";


export type AIProviderStatus =
    | "Active"
    | "Inactive"
    | "Testing"
    | "Deprecated";


export interface AIProvider extends BaseEntity {

    organizationId?: string;


    code: string;


    name: string;


    provider: AIProviderType;


    status?: AIProviderStatus;


    endpoint?: string;


    model: string;


    enabled: boolean;


    defaultProvider: boolean;


    supportsStreaming: boolean;


    supportsVision: boolean;


    supportsEmbeddings: boolean;


    supportsFunctions: boolean;


    configuration: Record<string, unknown>;


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}