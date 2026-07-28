import type {
    BaseEntity,
} from '@/types/platform/BaseEntity';

import type {
    EntityType,
} from '@/types/entity';



/**
 * ============================================================================
 * Attachment Entity
 * ============================================================================
 *
 * Universal attachment contract.
 *
 * Used across:
 * - CRM
 * - Tasks
 * - Activities
 * - Notes
 * - Entity Engine
 * - Future modules
 *
 * Database:
 * public.attachments
 *
 * ============================================================================ 
 */


export type AttachmentEntityType =
    EntityType;



export interface Attachment
    extends BaseEntity {


    /**
     * Universal entity reference
     */
    entityType: AttachmentEntityType;

    entityId: string;



    /**
     * File information
     */
    fileName: string;

    fileUrl: string;

    fileType: string;

    fileSize?: number;



    /**
     * Optional description
     */
    description?: string;



    /**
     * Ownership
     */
    uploadedBy?: string;



    /**
     * Audit fields
     */
    uploadedAt: string;



    /**
     * Soft delete/archive support
     *
     * Kept for CRM compatibility
     */
    archived: boolean;

}



export interface AttachmentSearchFilters {


    entityType?: AttachmentEntityType;


    entityId?: string;


    uploadedBy?: string;


    fileType?: string;


    search?: string;

}



export interface AttachmentSummary {


    total: number;


    active: number;


    archived: number;

}



export interface CreateAttachmentRequest {


    entityType: AttachmentEntityType;


    entityId: string;


    fileName: string;


    fileUrl: string;


    fileType: string;


    fileSize?: number;


    description?: string;

}



export interface UpdateAttachmentRequest {


    fileName?: string;


    fileUrl?: string;


    fileType?: string;


    fileSize?: number;


    description?: string;

}