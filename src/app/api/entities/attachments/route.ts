import {
    NextRequest,
    NextResponse,
} from 'next/server';

import {
    createClient,
} from '@/lib/supabase/server';

import {
    createAttachmentService,
} from '@/services/crm/AttachmentService';

import type {
    AttachmentEntityType,
    AttachmentSearchFilters,
    CreateAttachmentRequest,
    UpdateAttachmentRequest,
} from '@/types/crm/Attachment';

const ENTITY_TYPES: AttachmentEntityType[] = [
    'Lead',
    'Company',
    'Contact',
    'Opportunity',
    'Project',
    'Task',
    'Quotation',
    'Contract',
    'Invoice',
    'Ticket',
    'Activity',
    'Payment',
    'Other',
];

function isEntityType(
    value: unknown,
): value is AttachmentEntityType {
    return (
        typeof value === 'string' &&
        ENTITY_TYPES.includes(
            value as AttachmentEntityType,
        )
    );
}

function isRecord(
    value: unknown,
): value is Record<string, unknown> {
    return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
    );
}

function errorResponse(
    message: string,
    status: number,
): NextResponse {
    return NextResponse.json(
        {
            success: false,
            error: message,
        },
        {
            status,
        },
    );
}

function stringValue(
    value: unknown,
): string | undefined {
    if (typeof value !== 'string') {
        return undefined;
    }

    const trimmed =
        value.trim();

    return trimmed || undefined;
}

function numberValue(
    value: unknown,
): number | undefined {
    if (
        typeof value !== 'number' ||
        !Number.isFinite(value)
    ) {
        return undefined;
    }

    return value;
}

/**
 * GET
 *
 * Supports:
 *   ?id=
 *   ?entityType=
 *   ?entityId=
 *   ?uploadedBy=
 *   ?fileType=
 *   ?mimeType=
 *   ?search=
 *   ?includeArchived=true
 *   ?includeDeleted=true
 */
export async function GET(
    request: NextRequest,
): Promise<Response> {
    try {
        const supabase =
            await createClient();

        const service =
            createAttachmentService(
                supabase,
            );

        const params =
            request.nextUrl.searchParams;

        const id =
            stringValue(
                params.get('id'),
            );

        if (id) {
            const attachment =
                await service.findById(
                    id,
                );

            if (!attachment) {
                return errorResponse(
                    'Attachment not found.',
                    404,
                );
            }

            return NextResponse.json({
                success: true,
                data: attachment,
            });
        }

        const entityTypeValue =
            stringValue(
                params.get(
                    'entityType',
                ),
            );

        const entityId =
            stringValue(
                params.get(
                    'entityId',
                ),
            );

        const uploadedBy =
            stringValue(
                params.get(
                    'uploadedBy',
                ),
            );

        const fileType =
            stringValue(
                params.get(
                    'fileType',
                ),
            );

        const mimeType =
            stringValue(
                params.get(
                    'mimeType',
                ),
            );

        const search =
            stringValue(
                params.get(
                    'search',
                ),
            );

        const includeArchived =
            params.get(
                'includeArchived',
            ) === 'true';

        const includeDeleted =
            params.get(
                'includeDeleted',
            ) === 'true';

        if (
            entityTypeValue &&
            !isEntityType(
                entityTypeValue,
            )
        ) {
            return errorResponse(
                'Invalid attachment entity type.',
                400,
            );
        }

        const filters: AttachmentSearchFilters = {
            entityType:
                entityTypeValue &&
                isEntityType(
                    entityTypeValue,
                )
                    ? entityTypeValue
                    : undefined,

            entityId,

            uploadedBy,

            fileType,

            mimeType,

            search,

            includeArchived,

            includeDeleted,
        };

        const hasFilters =
            Boolean(
                filters.entityType ||
                filters.entityId ||
                filters.uploadedBy ||
                filters.fileType ||
                filters.mimeType ||
                filters.search ||
                filters.includeArchived ||
                filters.includeDeleted,
            );

        const attachments =
            hasFilters
                ? await service.search(
                    filters,
                )
                : await service.list();

        return NextResponse.json({
            success: true,
            data: attachments,
        });
    } catch (error) {
        console.error(
            'ATTACHMENTS_GET_ERROR',
            error,
        );

        return errorResponse(
            'Failed to load attachments.',
            500,
        );
    }
}

/**
 * POST
 *
 * Creates a new attachment record.
 *
 * Storage upload itself remains outside this CRUD endpoint.
 * The API persists the attachment metadata/reference.
 */
export async function POST(
    request: NextRequest,
): Promise<Response> {
    try {
        const body =
            await request.json();

        if (!isRecord(body)) {
            return errorResponse(
                'Invalid request body.',
                400,
            );
        }

        const entityType =
            body.entityType;

        const entityId =
            stringValue(
                body.entityId,
            );

        const fileName =
            stringValue(
                body.fileName,
            );

        const fileUrl =
            stringValue(
                body.fileUrl,
            );

        const fileType =
            stringValue(
                body.fileType,
            );

        if (!isEntityType(entityType)) {
            return errorResponse(
                'A valid attachment entity type is required.',
                400,
            );
        }

        if (!entityId) {
            return errorResponse(
                'Attachment entity ID is required.',
                400,
            );
        }

        if (!fileName) {
            return errorResponse(
                'Attachment file name is required.',
                400,
            );
        }

        if (!fileUrl) {
            return errorResponse(
                'Attachment file URL is required.',
                400,
            );
        }

        if (!fileType) {
            return errorResponse(
                'Attachment file type is required.',
                400,
            );
        }

        const fileSize =
            numberValue(
                body.fileSize,
            );

        if (
            body.fileSize !== undefined &&
            (
                fileSize === undefined ||
                fileSize < 0
            )
        ) {
            return errorResponse(
                'Attachment file size must be a non-negative number.',
                400,
            );
        }

        const input: CreateAttachmentRequest = {
            entityType,

            entityId,

            fileName,

            fileUrl,

            storagePath:
                stringValue(
                    body.storagePath,
                ),

            fileType,

            mimeType:
                stringValue(
                    body.mimeType,
                ),

            fileSize,

            description:
                stringValue(
                    body.description,
                ),

            uploadedBy:
                stringValue(
                    body.uploadedBy,
                ),
        };

        const supabase =
            await createClient();

        const service =
            createAttachmentService(
                supabase,
            );

        const attachment =
            await service.create(
                input,
            );

        return NextResponse.json(
            {
                success: true,
                data: attachment,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error(
            'ATTACHMENT_CREATE_ERROR',
            error,
        );

        return errorResponse(
            error instanceof Error
                ? error.message
                : 'Failed to create attachment.',
            400,
        );
    }
}

/**
 * PATCH
 *
 * Updates attachment metadata.
 *
 * Required:
 *   ?id=<attachment-id>
 */
export async function PATCH(
    request: NextRequest,
): Promise<Response> {
    try {
        const id =
            stringValue(
                request.nextUrl.searchParams.get(
                    'id',
                ),
            );

        if (!id) {
            return errorResponse(
                'Attachment ID is required.',
                400,
            );
        }

        const body =
            await request.json();

        if (!isRecord(body)) {
            return errorResponse(
                'Invalid request body.',
                400,
            );
        }

        const payload: UpdateAttachmentRequest = {
            fileName:
                stringValue(
                    body.fileName,
                ),

            fileUrl:
                stringValue(
                    body.fileUrl,
                ),

            storagePath:
                stringValue(
                    body.storagePath,
                ),

            fileType:
                stringValue(
                    body.fileType,
                ),

            mimeType:
                stringValue(
                    body.mimeType,
                ),

            fileSize:
                numberValue(
                    body.fileSize,
                ),

            description:
                typeof body.description ===
                'string'
                    ? body.description
                    : undefined,

            previewAllowed:
                typeof body.previewAllowed ===
                'boolean'
                    ? body.previewAllowed
                    : undefined,

            downloadAllowed:
                typeof body.downloadAllowed ===
                'boolean'
                    ? body.downloadAllowed
                    : undefined,
        };

        if (
            body.fileSize !== undefined &&
            (
                payload.fileSize === undefined ||
                payload.fileSize < 0
            )
        ) {
            return errorResponse(
                'Attachment file size must be a non-negative number.',
                400,
            );
        }

        const supabase =
            await createClient();

        const service =
            createAttachmentService(
                supabase,
            );

        const existing =
            await service.findById(
                id,
            );

        if (!existing) {
            return errorResponse(
                'Attachment not found.',
                404,
            );
        }

        const attachment =
            await service.update(
                id,
                payload,
            );

        return NextResponse.json({
            success: true,
            data: attachment,
        });
    } catch (error) {
        console.error(
            'ATTACHMENT_UPDATE_ERROR',
            error,
        );

        return errorResponse(
            error instanceof Error
                ? error.message
                : 'Failed to update attachment.',
            400,
        );
    }
}

/**
 * DELETE
 *
 * Performs the repository/service soft-delete operation.
 *
 * Required:
 *   ?id=<attachment-id>
 */
export async function DELETE(
    request: NextRequest,
): Promise<Response> {
    try {
        const id =
            stringValue(
                request.nextUrl.searchParams.get(
                    'id',
                ),
            );

        if (!id) {
            return errorResponse(
                'Attachment ID is required.',
                400,
            );
        }

        const supabase =
            await createClient();

        const service =
            createAttachmentService(
                supabase,
            );

        const existing =
            await service.findById(
                id,
            );

        if (!existing) {
            return errorResponse(
                'Attachment not found.',
                404,
            );
        }

        await service.delete(
            id,
        );

        return NextResponse.json({
            success: true,
            data: {
                id,
                deleted: true,
            },
        });
    } catch (error) {
        console.error(
            'ATTACHMENT_DELETE_ERROR',
            error,
        );

        return errorResponse(
            error instanceof Error
                ? error.message
                : 'Failed to delete attachment.',
            400,
        );
    }
}
