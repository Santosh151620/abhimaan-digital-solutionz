"use server";

import {
    revalidatePath,
} from "next/cache";

import {
    createClient,
} from "@/lib/supabase/server";

import {
    AttachmentsService,
} from "@/services/attachments.service";

import type {
    Attachment,
    AttachmentSearchFilters,
    CreateAttachmentRequest,
    UpdateAttachmentRequest,
} from "@/types/crm/Attachment";

async function getService(): Promise<AttachmentsService> {
    const supabase =
        await createClient();

    return new AttachmentsService(
        supabase,
    );
}

function requireId(
    id: string,
    field = "Attachment ID",
): string {
    const value =
        id?.trim();

    if (!value) {
        throw new Error(
            `${field} is required.`,
        );
    }

    return value;
}

function normalizeCreatePayload(
    data: Partial<Attachment>,
): CreateAttachmentRequest {
    const fileName =
        data.fileName?.trim();

    const fileUrl =
        data.fileUrl?.trim();

    const entityId =
        data.entityId?.trim();

    if (!fileName) {
        throw new Error(
            "File name is required.",
        );
    }

    if (!fileUrl) {
        throw new Error(
            "File URL is required.",
        );
    }

    if (!entityId) {
        throw new Error(
            "Entity ID is required.",
        );
    }

    if (!data.entityType) {
        throw new Error(
            "Entity type is required.",
        );
    }

    if (!data.fileType?.trim()) {
        throw new Error(
            "File type is required.",
        );
    }

    return {
        entityType:
            data.entityType,

        entityId,

        fileName,

        fileUrl,

        storagePath:
            data.storagePath?.trim() ||
            undefined,

        fileType:
            data.fileType.trim(),

        mimeType:
            data.mimeType?.trim() ||
            undefined,

        fileSize:
            data.fileSize,

        description:
            data.description?.trim() ||
            undefined,

        uploadedBy:
            data.uploadedBy?.trim() ||
            undefined,
    };
}

function normalizeUpdatePayload(
    data: Partial<Attachment>,
): UpdateAttachmentRequest {
    return {
        fileName:
            data.fileName?.trim() ||
            undefined,

        fileUrl:
            data.fileUrl?.trim() ||
            undefined,

        storagePath:
            data.storagePath?.trim() ||
            undefined,

        fileType:
            data.fileType?.trim() ||
            undefined,

        mimeType:
            data.mimeType?.trim() ||
            undefined,

        fileSize:
            data.fileSize,

        description:
            data.description?.trim() ||
            undefined,

        previewAllowed:
            data.previewAllowed,

        downloadAllowed:
            data.downloadAllowed,
    };
}

export async function getAttachments(): Promise<Attachment[]> {
    const service =
        await getService();

    return service.list(
        undefined,
        undefined,
        false,
        false,
    );
}

export async function getAttachment(
    id: string,
): Promise<Attachment | null> {
    const service =
        await getService();

    return service.details(
        requireId(id),
    );
}

export async function getEntityAttachments(
    entityType: string,
    entityId: string,
): Promise<Attachment[]> {
    const normalizedEntityType =
        entityType?.trim();

    const normalizedEntityId =
        entityId?.trim();

    if (!normalizedEntityType) {
        throw new Error(
            "Entity type is required.",
        );
    }

    if (!normalizedEntityId) {
        throw new Error(
            "Entity ID is required.",
        );
    }

    const service =
        await getService();

    return service.findByEntity(
        normalizedEntityType,
        normalizedEntityId,
    );
}

export async function searchAttachments(
    filters?: AttachmentSearchFilters,
): Promise<Attachment[]> {
    const service =
        await getService();

    return service.search(
        filters,
    );
}

export async function createAttachment(
    data: Partial<Attachment>,
): Promise<Attachment> {
    const service =
        await getService();

    const payload =
        normalizeCreatePayload(
            data,
        );

    const attachment =
        await service.create(
            payload,
        );

    revalidatePath(
        "/crm/attachments",
    );

    revalidatePath(
        `/crm/attachments/${attachment.id}`,
    );

    return attachment;
}

export async function updateAttachment(
    id: string,
    data: Partial<Attachment>,
): Promise<Attachment> {
    const attachmentId =
        requireId(id);

    const service =
        await getService();

    const payload =
        normalizeUpdatePayload(
            data,
        );

    const attachment =
        await service.update(
            attachmentId,
            payload,
        );

    revalidatePath(
        "/crm/attachments",
    );

    revalidatePath(
        `/crm/attachments/${attachmentId}`,
    );

    return attachment;
}

export async function deleteAttachment(
    id: string,
): Promise<void> {
    const attachmentId =
        requireId(id);

    const service =
        await getService();

    await service.delete(
        attachmentId,
    );

    revalidatePath(
        "/crm/attachments",
    );

    revalidatePath(
        `/crm/attachments/${attachmentId}`,
    );
}

export async function restoreAttachment(
    id: string,
): Promise<{
    success: boolean;
    attachment: Attachment | null;
}> {
    const attachmentId =
        requireId(id);

    const service =
        await getService();

    const attachment =
        await service.restore(
            attachmentId,
        );

    if (!attachment) {
        return {
            success: false,
            attachment: null,
        };
    }

    revalidatePath(
        "/crm/attachments",
    );

    revalidatePath(
        `/crm/attachments/${attachmentId}`,
    );

    return {
        success: true,
        attachment,
    };
}

export async function getAttachmentSummary() {
    const service =
        await getService();

    return service.summary();
}
