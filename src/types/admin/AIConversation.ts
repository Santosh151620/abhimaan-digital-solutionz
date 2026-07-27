/**
 * ============================================================================
 * AI Conversation
 * Enterprise AI Interaction Contract
 * ============================================================================
 */

import type { BaseEntity } from "@/types/platform/BaseEntity";


export interface AIConversation extends BaseEntity {

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


    messageCount?: number;


    metadata?: Record<string, unknown>;


    startedAt: string;


    lastMessageAt?: string;

}
