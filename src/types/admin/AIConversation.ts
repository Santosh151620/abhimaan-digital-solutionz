/**
 * ============================================================================
 * Abhimaan Digital Solutionz
 * AI Conversation
 * Enterprise AI Interaction Contract
 * ============================================================================
 *
 * Contract-only definition.
 *
 * Persistence, tenant isolation, authorization, provider execution and
 * conversation/message orchestration belong to their respective layers.
 * ============================================================================
 */

import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



/**
 * Enterprise AI conversation contract.
 *
 * A conversation belongs to exactly one organization and one user.
 *
 * It may optionally be associated with:
 * - an AI agent,
 * - an application module,
 * - a CRM/entity record.
 *
 * Provider and usage information are retained as conversation-level metadata
 * where available.
 */
export interface AIConversation
    extends BaseEntity {


    /**
     * Organization owning the conversation.
     *
     * Required for tenant isolation.
     */
    organizationId: string;



    /**
     * User who owns/initiated the conversation.
     */
    userId: string;



    /**
     * AI provider used by the conversation.
     */
    providerId: string;



    /**
     * Optional AI agent responsible for the conversation.
     */
    agentId?: string;



    /**
     * Optional application module associated with the conversation.
     *
     * Examples:
     * CRM, Leads, Companies, Projects, etc.
     */
    moduleCode?: string;



    /**
     * Optional business entity associated with the conversation.
     */
    entityType?: string;

    entityId?: string;



    /**
     * Optional human-readable conversation title.
     */
    title?: string;



    /**
     * Aggregate token usage for the conversation.
     */
    tokenUsage?: number;



    /**
     * Estimated provider/API cost for the conversation.
     */
    estimatedCost?: number;



    /**
     * Number of messages currently associated with the conversation.
     */
    messageCount?: number;



    /**
     * Extensible provider/application metadata.
     */
    metadata?: Record<string, unknown>;



    /**
     * Conversation creation/start timestamp.
     *
     * Expected format: ISO-8601 UTC string.
     */
    startedAt: string;



    /**
     * Timestamp of the most recent message.
     *
     * Expected format: ISO-8601 UTC string.
     */
    lastMessageAt?: string;

}