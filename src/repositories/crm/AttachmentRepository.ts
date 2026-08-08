import type { SupabaseClient } from '@supabase/supabase-js';

import type {
    Attachment,
    AttachmentEntityType,
    AttachmentSearchFilters,
    CreateAttachmentRequest,
    UpdateAttachmentRequest,
    AttachmentSummary,
} from '@/types/crm/Attachment';

const TABLE_NAME = 'attachments';

type AttachmentRow = Record<string, unknown>;

function requiredString(
    value: unknown,
    field: string,
): string {
    if (typeof value !== 'string') {
        throw new Error(
            `Attachment field "${field}" is missing or invalid.`,
        );
    }

    const normalized = value.trim();

    if (!normalized) {
        throw new Error(
            `Attachment field "${field}" is required.`,
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

    const normalized = value.trim();

    return normalized || undefined;
}

function mapAttachment(
    row: AttachmentRow,
): Attachment {
    return {
        id: requiredString(
            row.id,
            'id',
        ),

        entityType:
            row.entity_type as AttachmentEntityType,

        entityId: requiredString(
            row.entity_id,
            'entityId',
        ),

        fileName: requiredString(
            row.file_name,
            'fileName',
        ),

        fileUrl: requiredString(
            row.file_url,
            'fileUrl',
        ),

        storagePath:
            optionalString(
                row.storage_path,
            ),

        fileType: requiredString(
            row.file_type,
            'fileType',
        ),

        mimeType:
            optionalString(
                row.mime_type,
            ),

        fileSize:
            typeof row.file_size === 'number' &&
            Number.isFinite(row.file_size)
                ? row.file_size
                : undefined,

        description:
            optionalString(
                row.description,
            ),

        uploadedBy:
            optionalString(
                row.uploaded_by,
            ),

        uploadedAt: requiredString(
            row.uploaded_at,
            'uploadedAt',
        ),

        previewAllowed:
            row.preview_allowed === true,

        downloadAllowed:
            row.download_allowed !== false,

        version:
            typeof row.version === 'number' &&
            Number.isFinite(row.version)
                ? row.version
                : 1,

        parentAttachmentId:
            optionalString(
                row.parent_attachment_id,
            ),

        checksum:
            optionalString(
                row.checksum,
            ),

        archived:
            row.archived === true,

        isDeleted:
            row.is_deleted === true,

        deletedAt:
            optionalString(
                row.deleted_at,
            ),

        createdAt: requiredString(
            row.created_at,
            'createdAt',
        ),

        updatedAt:
            optionalString(
                row.updated_at,
            ),
    };
}

function cleanCreatePayload(
    data: CreateAttachmentRequest,
): Record<string, unknown> {
    return {
        entity_type:
            data.entityType,

        entity_id:
            data.entityId,

        file_name:
            data.fileName,

        file_url:
            data.fileUrl,

        storage_path:
            data.storagePath ?? null,

        file_type:
            data.fileType,

        mime_type:
            data.mimeType ?? null,

        file_size:
            data.fileSize ?? null,

        description:
            data.description ?? null,

        uploaded_by:
            data.uploadedBy ?? null,
    };
}

function cleanUpdatePayload(
    data: UpdateAttachmentRequest,
): Record<string, unknown> {
    const payload: Record<string, unknown> = {};

    if (data.fileName !== undefined) {
        payload.file_name =
            data.fileName;
    }

    if (data.fileUrl !== undefined) {
        payload.file_url =
            data.fileUrl;
    }

    if (data.storagePath !== undefined) {
        payload.storage_path =
            data.storagePath;
    }

    if (data.fileType !== undefined) {
        payload.file_type =
            data.fileType;
    }

    if (data.mimeType !== undefined) {
        payload.mime_type =
            data.mimeType;
    }

    if (data.fileSize !== undefined) {
        payload.file_size =
            data.fileSize;
    }

    if (data.description !== undefined) {
        payload.description =
            data.description;
    }

    if (data.previewAllowed !== undefined) {
        payload.preview_allowed =
            data.previewAllowed;
    }

    if (data.downloadAllowed !== undefined) {
        payload.download_allowed =
            data.downloadAllowed;
    }

    return payload;
}

export class AttachmentRepository {
    private readonly supabase: SupabaseClient;

    constructor(
        supabase: SupabaseClient,
    ) {
        this.supabase =
            supabase;
    }

    async list(
        entityType?: string,
        entityId?: string,
        includeArchived = false,
        includeDeleted = false,
    ): Promise<Attachment[]> {
        let query =
            this.supabase
                .from(TABLE_NAME)
                .select('*')
                .order(
                    'created_at',
                    {
                        ascending: false,
                    },
                );

        if (entityType) {
            query =
                query.eq(
                    'entity_type',
                    entityType,
                );
        }

        if (entityId) {
            query =
                query.eq(
                    'entity_id',
                    entityId,
                );
        }

        if (!includeArchived) {
            query =
                query.eq(
                    'archived',
                    false,
                );
        }

        if (!includeDeleted) {
            query =
                query.eq(
                    'is_deleted',
                    false,
                );
        }

        const {
            data,
            error,
        } = await query;

        if (error) {
            throw error;
        }

        return (
            data ?? []
        ).map(
            row =>
                mapAttachment(
                    row as AttachmentRow,
                ),
        );
    }

    async findById(
        id: string,
    ): Promise<Attachment | null> {
        const {
            data,
            error,
        } =
            await this.supabase
                .from(TABLE_NAME)
                .select('*')
                .eq(
                    'id',
                    id,
                )
                .maybeSingle();

        if (error) {
            throw error;
        }

        return data
            ? mapAttachment(
                data as AttachmentRow,
            )
            : null;
    }

    /**
     * Canonical entity lookup.
     */
    async findByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Attachment[]> {
        return this.list(
            entityType,
            entityId,
            false,
            false,
        );
    }

    /**
     * Compatibility alias used by existing
     * task attachment actions and services.
     */
    async listByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Attachment[]> {
        return this.findByEntity(
            entityType,
            entityId,
        );
    }

    async search(
        filters?: AttachmentSearchFilters,
    ): Promise<Attachment[]> {
        let query =
            this.supabase
                .from(TABLE_NAME)
                .select('*')
                .order(
                    'created_at',
                    {
                        ascending: false,
                    },
                );

        if (filters?.entityType) {
            query =
                query.eq(
                    'entity_type',
                    filters.entityType,
                );
        }

        if (filters?.entityId) {
            query =
                query.eq(
                    'entity_id',
                    filters.entityId,
                );
        }

        if (filters?.uploadedBy) {
            query =
                query.eq(
                    'uploaded_by',
                    filters.uploadedBy,
                );
        }

        if (filters?.fileType) {
            query =
                query.eq(
                    'file_type',
                    filters.fileType,
                );
        }

        if (filters?.mimeType) {
            query =
                query.eq(
                    'mime_type',
                    filters.mimeType,
                );
        }

        if (!filters?.includeArchived) {
            query =
                query.eq(
                    'archived',
                    false,
                );
        }

        if (!filters?.includeDeleted) {
            query =
                query.eq(
                    'is_deleted',
                    false,
                );
        }

        if (filters?.search) {
            const value =
                filters.search
                    .trim()
                    .replace(
                        /[%_]/g,
                        '\\$&',
                    );

            if (value) {
                query =
                    query.or(
                        [
                            `file_name.ilike.%${value}%`,
                            `description.ilike.%${value}%`,
                            `file_type.ilike.%${value}%`,
                            `mime_type.ilike.%${value}%`,
                        ].join(','),
                    );
            }
        }

        const {
            data,
            error,
        } = await query;

        if (error) {
            throw error;
        }

        return (
            data ?? []
        ).map(
            row =>
                mapAttachment(
                    row as AttachmentRow,
                ),
        );
    }

    async create(
        data: CreateAttachmentRequest,
    ): Promise<Attachment> {
        const {
            data: created,
            error,
        } =
            await this.supabase
                .from(TABLE_NAME)
                .insert(
                    cleanCreatePayload(
                        data,
                    ),
                )
                .select('*')
                .single();

        if (error) {
            throw error;
        }

        return mapAttachment(
            created as AttachmentRow,
        );
    }

    async update(
        id: string,
        data: UpdateAttachmentRequest,
    ): Promise<Attachment> {
        const payload =
            cleanUpdatePayload(
                data,
            );

        if (
            Object.keys(payload).length ===
            0
        ) {
            const existing =
                await this.findById(
                    id,
                );

            if (!existing) {
                throw new Error(
                    'Attachment not found.',
                );
            }

            return existing;
        }

        const {
            data: updated,
            error,
        } =
            await this.supabase
                .from(TABLE_NAME)
                .update(
                    payload,
                )
                .eq(
                    'id',
                    id,
                )
                .select('*')
                .single();

        if (error) {
            throw error;
        }

        return mapAttachment(
            updated as AttachmentRow,
        );
    }

    async delete(
        id: string,
    ): Promise<void> {
        const {
            error,
        } =
            await this.supabase
                .from(TABLE_NAME)
                .update({
                    is_deleted: true,
                    deleted_at:
                        new Date().toISOString(),
                })
                .eq(
                    'id',
                    id,
                );

        if (error) {
            throw error;
        }
    }

    async restore(
        id: string,
    ): Promise<Attachment | null> {
        const {
            data,
            error,
        } =
            await this.supabase
                .from(TABLE_NAME)
                .update({
                    is_deleted: false,
                    deleted_at: null,
                    archived: false,
                })
                .eq(
                    'id',
                    id,
                )
                .select('*')
                .maybeSingle();

        if (error) {
            throw error;
        }

        return data
            ? mapAttachment(
                data as AttachmentRow,
            )
            : null;
    }

    async archive(
        id: string,
    ): Promise<Attachment | null> {
        const {
            data,
            error,
        } =
            await this.supabase
                .from(TABLE_NAME)
                .update({
                    archived: true,
                })
                .eq(
                    'id',
                    id,
                )
                .select('*')
                .maybeSingle();

        if (error) {
            throw error;
        }

        return data
            ? mapAttachment(
                data as AttachmentRow,
            )
            : null;
    }

    async summary(): Promise<AttachmentSummary> {
        const attachments =
            await this.list(
                undefined,
                undefined,
                true,
                true,
            );

        return {
            total:
                attachments.length,

            active:
                attachments.filter(
                    attachment =>
                        !attachment.archived &&
                        !attachment.isDeleted,
                ).length,

            archived:
                attachments.filter(
                    attachment =>
                        attachment.archived &&
                        !attachment.isDeleted,
                ).length,

            deleted:
                attachments.filter(
                    attachment =>
                        attachment.isDeleted,
                ).length,

            storageUsed:
                attachments.reduce(
                    (
                        total,
                        attachment,
                    ) =>
                        total +
                        (
                            attachment.fileSize ??
                            0
                        ),
                    0,
                ),
        };
    }
}

export function createAttachmentRepository(
    supabase: SupabaseClient,
): AttachmentRepository {
    return new AttachmentRepository(
        supabase,
    );
}