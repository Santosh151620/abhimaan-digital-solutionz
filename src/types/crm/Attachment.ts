import type {
    BaseEntity,
} from "@/types/platform/BaseEntity";



/**
 * Supported CRM entities.
 *
 * Entity driven design.
 * No module-specific foreign keys.
 */
export type AttachmentEntityType =
    | "Lead"
    | "Company"
    | "Contact"
    | "Opportunity"
    | "Project"
    | "Task"
    | "Quotation"
    | "Contract"
    | "Invoice"
    | "Ticket"
    | "Activity"
    | "Payment"
    | "Other";



/**
 * Universal Attachment Entity
 */
export interface Attachment extends BaseEntity {


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


    /**
     * Supabase Storage path
     */
    storagePath?: string;


    /**
     * File metadata
     */
    fileType: string;


    mimeType?: string;


    fileSize?: number;


    /**
     * Integrity validation
     */
    checksum?: string;



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
     * Version control
     */
    version?: number;


    parentAttachmentId?: string;



    /**
     * Permission capabilities
     */
    previewAllowed?: boolean;


    downloadAllowed?: boolean;



    /**
     * Soft delete/archive support
     *
     * Existing CRM compatibility preserved.
     */
    archived: boolean;


    /**
     * Enterprise soft delete
     */
    isDeleted?: boolean;


    deletedAt?: string;


    deletedBy?: string;

}



/**
 * Attachment filtering
 */
export interface AttachmentSearchFilters {


    entityType?: AttachmentEntityType;


    entityId?: string;


    uploadedBy?: string;


    fileType?: string;


    mimeType?: string;


    search?: string;


    includeArchived?: boolean;


    includeDeleted?: boolean;

}



/**
 * Attachment statistics
 */
export interface AttachmentSummary {


    total: number;


    active: number;


    archived: number;


    deleted?: number;


    storageUsed?: number;

}



/**
 * Create attachment request
 */
export interface CreateAttachmentRequest {


    entityType: AttachmentEntityType;


    entityId: string;


    fileName: string;


    fileUrl: string;


    storagePath?: string;


    fileType: string;


    mimeType?: string;


    fileSize?: number;


    description?: string;


    uploadedBy?: string;

}



/**
 * Update attachment request
 */
export interface UpdateAttachmentRequest {


    fileName?: string;


    fileUrl?: string;


    storagePath?: string;


    fileType?: string;


    mimeType?: string;


    fileSize?: number;


    description?: string;


    previewAllowed?: boolean;


    downloadAllowed?: boolean;

}



/**
 * Attachment version information
 */
export interface AttachmentVersion {


    id: string;


    attachmentId: string;


    version: number;


    fileUrl: string;


    storagePath?: string;


    fileSize?: number;


    uploadedBy?: string;


    uploadedAt: string;

}
