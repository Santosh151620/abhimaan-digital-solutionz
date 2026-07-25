/**
 * ============================================================================
 * AI Agent
 * ============================================================================
 */

export type AgentScope =
    | "Platform"
    | "CRM"
    | "ERP"
    | "Module"
    | "Organization";

export interface AIAgent {

    id: string;

    organizationId?: string;

    code: string;

    name: string;

    description?: string;

    scope: AgentScope;

    providerId: string;

    promptId: string;

    enabledModules: string[];

    enabled: boolean;

    version: number;

    metadata?: Record<string, unknown>;

    createdAt: string;

    updatedAt?: string;

}