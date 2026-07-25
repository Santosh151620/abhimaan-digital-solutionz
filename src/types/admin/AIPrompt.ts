/**
 * ============================================================================
 * AI Prompt
 * ============================================================================
 */

export interface AIPrompt {

    id: string;

    organizationId?: string;

    code: string;

    name: string;

    description?: string;

    systemPrompt: string;

    userPromptTemplate: string;

    temperature: number;

    maxTokens: number;

    version: number;

    active: boolean;

    createdAt: string;

    updatedAt?: string;

}