/**
 * ============================================================================
 * AI Prompt
 * Enterprise Prompt Management Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export interface AIPrompt extends BaseEntity {

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


    metadata?: Record<string, unknown>;


    createdBy?: string;


    updatedBy?: string;

}
