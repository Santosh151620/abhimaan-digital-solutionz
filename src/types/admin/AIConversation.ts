/**
 * ============================================================================
 * AI Conversation
 * ============================================================================
 */

export interface AIConversation {

    id: string;

    organizationId: string;

    userId: string;

    providerId: string;

    agentId?: string;

    moduleCode?: string;

    entityType?: string;

    entityId?: string;

    title?: string;

    tokenUsage?: number;

    estimatedCost?: number;

    metadata?: Record<string, unknown>;

    startedAt: string;

    lastMessageAt?: string;

}