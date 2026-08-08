"use server";

import {
    createClient,
} from "@/lib/supabase/server";

import {
    createAttachmentRepository,
} from "@/repositories/crm/AttachmentRepository";

async function getRepository() {
    const supabase =
        await createClient();

    return createAttachmentRepository(
        supabase,
    );
}

function requireTaskId(
    taskId: string,
): string {
    const value =
        taskId?.trim();

    if (!value) {
        throw new Error(
            "Task ID is required.",
        );
    }

    return value;
}

function requireAttachmentId(
    id: string,
): string {
    const value =
        id?.trim();

    if (!value) {
        throw new Error(
            "Attachment ID is required.",
        );
    }

    return value;
}

export async function getTaskAttachments(
    taskId: string,
) {
    const normalizedTaskId =
        requireTaskId(
            taskId,
        );

    const repository =
        await getRepository();

    return repository.listByEntity(
        "Task",
        normalizedTaskId,
    );
}

export async function createTaskAttachment(
    data: {
        fileName: string;
        fileUrl: string;
        fileType?: string;
        fileSize?: number;
        taskId: string;
    },
) {
    const taskId =
        requireTaskId(
            data.taskId,
        );

    const fileName =
        data.fileName?.trim();

    const fileUrl =
        data.fileUrl?.trim();

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

    const repository =
        await getRepository();

    return repository.create({
        entityType: "Task",
        entityId: taskId,
        fileName,
        fileUrl,
        fileType:
            data.fileType?.trim() ||
            "file",
        fileSize:
            data.fileSize,
    });
}

export async function deleteTaskAttachment(
    id: string,
) {
    const attachmentId =
        requireAttachmentId(
            id,
        );

    const repository =
        await getRepository();

    await repository.delete(
        attachmentId,
    );

    return {
        success: true,
    };
}