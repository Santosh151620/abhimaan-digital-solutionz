/**
 * ============================================================================
 * ADS CRM Attachment Service
 * ============================================================================
 *
 * Application/service boundary for CRM attachments.
 *
 * Responsibilities:
 * - Validate application inputs
 * - Normalize legacy/partial callers
 * - Delegate persistence to AttachmentRepository
 * - Preserve entityType + entityId architecture
 *
 * Persistence:
 * AttachmentRepository
 *
 * Security:
 * Supabase Auth + RLS remain the authoritative tenant boundary.
 * ============================================================================
 */

import type { SupabaseClient } from '@supabase/supabase-js';

import {
    AttachmentRepository,
    createAttachmentRepository,
} from '@/repositories/crm/AttachmentRepository';

import type {
    Attachment,
    AttachmentEntityType,
    AttachmentSearchFilters,
    AttachmentSummary,
    CreateAttachmentRequest,
    UpdateAttachmentRequest,
} from '@/types/crm/Attachment';

function requiredString(
    value: unknown,
    field: string,
): string {
    if (typeof value !== 'string') {
        throw new Error(
            `${field} is required.`,
        );
    }

    const normalized =
        value.trim();

    if (!normalized) {
        throw new Error(
            `${field} is required.`,
        );
    }

    return normalized;
}

function optionalString(
    value: unknown,
): string | undefined {
    if (typeof value !== 'string') {
        return undefined;
    }

    const normalized =
        value.trim();

    return normalized || undefined;
}

function toCreateRequest(
    data: Partial<Attachment>,
): CreateAttachmentRequest {
    const entityType =
        data.entityType;

    if (!entityType) {
        throw new Error(
            'Attachment entity type is required.',
        );
    }

    return {
        entityType:
            entityType as AttachmentEntityType,

        entityId:
            requiredString(
                data.entityId,
                'Attachment entity ID',
            ),

        fileName:
            requiredString(
                data.fileName,
                'Attachment file name',
            ),

        fileUrl:
            requiredString(
                data.fileUrl,
                'Attachment file URL',
            ),

        storagePath:
            optionalString(
                data.storagePath,
            ),

        fileType:
            requiredString(
                data.fileType,
                'Attachment file type',
            ),

        mimeType:
            optionalString(
                data.mimeType,
            ),

        fileSize:
            data.fileSize,

        description:
            optionalString(
                data.description,
            ),

        uploadedBy:
            optionalString(
                data.uploadedBy,
            ),
    };
}

function toUpdateRequest(
    data: Partial<Attachment>,
): UpdateAttachmentRequest {
    return {
        fileName:
            data.fileName !== undefined
                ? requiredString(
                    data.fileName,
                    'Attachment file name',
                )
                : undefined,

        fileUrl:
            data.fileUrl !== undefined
                ? requiredString(
                    data.fileUrl,
                    'Attachment file URL',
                )
                : undefined,

        storagePath:
            data.storagePath !== undefined
                ? optionalString(
                    data.storagePath,
                )
                : undefined,

        fileType:
            data.fileType !== undefined
                ? requiredString(
                    data.fileType,
                    'Attachment file type',
                )
                : undefined,

        mimeType:
            data.mimeType !== undefined
                ? optionalString(
                    data.mimeType,
                )
                : undefined,

        fileSize:
            data.fileSize,

        description:
            data.description,

        previewAllowed:
            data.previewAllowed,

        downloadAllowed:
            data.downloadAllowed,
    };
}

export class AttachmentService {
    private readonly repository: AttachmentRepository;

    constructor(
        supabase: SupabaseClient,
    ) {
        this.repository =
            createAttachmentRepository(
                supabase,
            );
    }

    async list(
        entityType?: string,
        entityId?: string,
        includeArchived = false,
        includeDeleted = false,
    ): Promise<Attachment[]> {
        return this.repository.list(
            entityType,
            entityId,
            includeArchived,
            includeDeleted,
        );
    }

    async listByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Attachment[]> {
        return this.repository.listByEntity(
            entityType,
            entityId,
        );
    }

    async findByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Attachment[]> {
        return this.repository.findByEntity(
            entityType,
            entityId,
        );
    }

    async details(
        id: string,
    ): Promise<Attachment | null> {
        return this.repository.findById(
            id,
        );
    }

    async findById(
        id: string,
    ): Promise<Attachment | null> {
        return this.repository.findById(
            id,
        );
    }

    async search(
        filters?: AttachmentSearchFilters,
    ): Promise<Attachment[]> {
        return this.repository.search(
            filters,
        );
    }

    async create(
        data: Partial<Attachment>,
    ): Promise<Attachment> {
        const request =
            toCreateRequest(
                data,
            );

        return this.repository.create(
            request,
        );
    }

    async update(
        id: string,
        data: Partial<Attachment>,
    ): Promise<Attachment> {
        const request =
            toUpdateRequest(
                data,
            );

        return this.repository.update(
            id,
            request,
        );
    }

    async delete(
        id: string,
    ): Promise<void> {
        return this.repository.delete(
            id,
        );
    }

    async restore(
        id: string,
    ): Promise<Attachment | null> {
        return this.repository.restore(
            id,
        );
    }

    async archive(
        id: string,
    ): Promise<Attachment | null> {
        return this.repository.archive(
            id,
        );
    }

    async summary(): Promise<AttachmentSummary> {
        return this.repository.summary();
    }
}

/**
 * Factory for server-side/service usage.
 */
export function createAttachmentService(
    supabase: SupabaseClient,
): AttachmentService {
    return new AttachmentService(
        supabase,
    );
}