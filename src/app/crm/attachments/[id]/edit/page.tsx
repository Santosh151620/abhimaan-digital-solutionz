import Link from 'next/link';
import {
    notFound,
    redirect,
} from 'next/navigation';

import {
    AttachmentForm,
} from '@/components/crm/attachments';

import {
    getAttachment,
    updateAttachment,
} from '../../actions';

import type {
    Attachment,
    UpdateAttachmentRequest,
} from '@/types/crm/Attachment';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export const dynamic = 'force-dynamic';

export default async function EditAttachmentPage({
    params,
}: Props) {
    const {
        id,
    } = await params;

    if (!id?.trim()) {
        notFound();
    }

    const attachment =
        await getAttachment(id);

    if (!attachment) {
        notFound();
    }

    async function submit(
        values: Partial<Attachment>,
    ) {
        'use server';

        const payload: UpdateAttachmentRequest = {
            fileName:
                values.fileName,
            fileUrl:
                values.fileUrl,
            storagePath:
                values.storagePath,
            fileType:
                values.fileType,
            mimeType:
                values.mimeType,
            fileSize:
                values.fileSize,
            description:
                values.description,
            previewAllowed:
                values.previewAllowed,
            downloadAllowed:
                values.downloadAllowed,
        };

        await updateAttachment(
            id,
            payload,
        );

        redirect(
            `/crm/attachments/${id}`,
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <div className="mb-2 text-sm text-muted-foreground">
                    <Link
                        href={`/crm/attachments/${id}`}
                        className="hover:underline"
                    >
                        Attachment
                    </Link>
                    {' / '}
                    Edit
                </div>

                <h1 className="text-2xl font-semibold">
                    Edit Attachment
                </h1>

                <p className="text-sm text-muted-foreground">
                    Update attachment information.
                </p>
            </div>

            <AttachmentForm
                initialValues={
                    attachment
                }
                onSubmit={
                    submit
                }
                onCancel={() =>
                    redirect(
                        `/crm/attachments/${id}`,
                    )
                }
            />
        </div>
    );
}
