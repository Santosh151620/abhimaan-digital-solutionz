/**
 * ============================================================================
 * Platform Base Entity
 * Shared by CRM, ERP, Admin and AI
 * ============================================================================
 */

export interface BaseEntity {

    id: string;

    organizationId?: string;

    metadata?: Record<string, unknown>;

    createdBy?: string;

    updatedBy?: string;

    createdAt: string;

    updatedAt?: string;

    deletedAt?: string;

}

export interface Activatable {

    isActive: boolean;

}

export interface SoftDelete {

    deletedAt?: string;

}

export interface Versioned {

    version: number;

}