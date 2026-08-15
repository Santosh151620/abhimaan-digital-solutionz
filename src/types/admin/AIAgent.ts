/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 * AI Agent
 * Enterprise AI Automation Contract
 * CRM + ERP Compatible
 * ============================================================================
 *
 * Contract-only definition.
 *
 * Persistence, authorization, tenant isolation, provider execution and
 * workflow orchestration belong to their respective service/repository layers.
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



/**
 * Scope in which an AI agent is allowed to operate.
 *
 * Platform:
 *   Cross-organization/platform capabilities.
 *
 * CRM:
 *   CRM-specific capabilities.
 *
 * ERP:
 *   Future ERP-compatible capabilities.
 *
 * Module:
 *   A specific application module.
 *
 * Organization:
 *   Organization-scoped automation.
 */
export type AgentScope =
    | "Platform"
    | "CRM"
    | "ERP"
    | "Module"
    | "Organization";



/**
 * Lifecycle state of an AI agent.
 */
export type AgentStatus =
    | "Draft"
    | "Active"
    | "Disabled"
    | "Archived";



/**
 * Enterprise AI agent contract.
 *
 * The contract is intentionally provider-agnostic so the implementation can
 * support different AI providers without coupling the platform model to a
 * specific vendor.
 */
export interface AIAgent
    extends BaseEntity {

    /**
     * Optional for platform-level agents.
     * Required by the persistence/authorization layer for organization-scoped
     * agents.
     */
    organizationId?: string;


    /**
     * Stable machine-readable identifier.
     */
    code: string;


    /**
     * Human-readable agent name.
     */
    name: string;


    /**
     * Optional business description.
     */
    description?: string;


    /**
     * Operational scope of the agent.
     */
    scope: AgentScope;


    /**
     * Identifier of the configured AI provider.
     */
    providerId: string;


    /**
     * Identifier of the prompt/template configuration.
     */
    promptId: string;


    /**
     * Modules that the agent is permitted to operate against.
     */
    enabledModules: string[];


    /**
     * Runtime enablement switch.
     */
    enabled: boolean;


    /**
     * Lifecycle status.
     */
    status?: AgentStatus;


    /**
     * Agent configuration/version number.
     */
    version: number;


    /**
     * Declared capabilities exposed by the agent.
     */
    capabilities?: string[];


    /**
     * Provider- or agent-specific extensibility data.
     */
    metadata?: Record<string, unknown>;


    /**
     * Audit ownership.
     */
    createdBy?: string;

    updatedBy?: string;

}