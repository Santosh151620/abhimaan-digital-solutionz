/**
 * ============================================================================
 * AI Agent
 * Enterprise AI Automation Contract
 * CRM + ERP Compatible
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export type AgentScope =
    | "Platform"
    | "CRM"
    | "ERP"
    | "Module"
    | "Organization";


export type AgentStatus =
    | "Draft"
    | "Active"
    | "Disabled"
    | "Archived";


export interface AIAgent extends BaseEntity {

    organizationId?: string;


    code: string;

    name: string;

    description?: string;


    scope: AgentScope;


    providerId: string;

    promptId: string;


    enabledModules: string[];


    enabled: boolean;


    status?: AgentStatus;


    version: number;


    capabilities?: string[];


    metadata?: Record<string, unknown>;


    createdBy?: string;

    updatedBy?: string;

}
