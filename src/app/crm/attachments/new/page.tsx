import Link from 'next/link';
import {
    redirect,
} from 'next/navigation';

import {
    AttachmentForm,
} from '@/components/crm/attachments';

import {
    createAttachment,
} from '../actions';

import type {
    Attachment,
    AttachmentEntityType,
} from '@/types/crm/Attachment';

interface Props {
    searchParams?: Promise<{
        entityType?: string;
        entityId?: string;
    }>;
}

function getFileType(
    fileName: string,
): string {
    const trimmed =
        fileName.trim();

    const lastDot =
        trimmed.lastIndexOf('.');

    if (
        lastDot < 0 ||
        lastDot === trimmed.length - 1
    ) {
        return 'file';
    }

    return trimmed
        .slice(lastDot + 1)
        .toLowerCase();
}

function isEntityType(
    value: string | undefined,
): value is AttachmentEntityType {
    return [
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
    ].includes(
        value ?? '',
    );
}

export default async function NewAttachmentPage({
    searchParams,
}: Props) {
    const params =
        await searchParams;

    const initialEntityType =
        isEntityType(
            params?.entityType,
        )
            ? params.entityType
            : 'Other';

    const initialEntityId =
        params?.entityId ?? '';

    async function submit(
        values: Partial<Attachment>,
    ) {
        'use server';

        const fileName =
            values.fileName?.trim();

        const fileUrl =
            values.fileUrl?.trim();

        const entityId =
            values.entityId?.trim();

        if (!fileName) {
            throw new Error(
                'File name is required.',
            );
        }

        if (!fileUrl) {
            throw new Error(
                'File URL is required.',
            );
        }

        if (!entityId) {
            throw new Error(
                'Entity ID is required.',
            );
        }

        const attachment =
            await createAttachment({
                entityType:
                    values.entityType ??
                    'Other',

                entityId,

                fileName,

                fileUrl,

                storagePath:
                    values.storagePath,

                fileType:
                    values.fileType ??
                    getFileType(
                        fileName,
                    ),

                mimeType:
                    values.mimeType,

                fileSize:
                    values.fileSize,

                description:
                    values.description,

                uploadedBy:
                    values.uploadedBy,

                previewAllowed:
                    values.previewAllowed ??
                    true,

                downloadAllowed:
                    values.downloadAllowed ??
                    true,

                version:
                    values.version ??
                    1,

                parentAttachmentId:
                    values.parentAttachmentId,
            });

        redirect(
            `/crm/attachments/${attachment.id}`,
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <div className="mb-2 text-sm text-muted-foreground">
                    <Link
                        href="/crm/attachments"
                        className="hover:underline"
                    >
                        Attachments
                    </Link>

                    {' / '}

                    New
                </div>

                <h1 className="text-2xl font-semibold">
                    Create Attachment
                </h1>

                <p className="text-sm text-muted-foreground">
                    Add a file attachment to a CRM entity.
                </p>
            </div>

            <AttachmentForm
                initialValues={{
                    entityType:
                        initialEntityType,

                    entityId:
                        initialEntityId,
                }}
                onSubmit={
                    submit
                }
                onCancel={() =>
                    redirect(
                        '/crm/attachments',
                    )
                }
            />
        </div>
    );
}
