import Link from 'next/link';
import {
    notFound,
} from 'next/navigation';

import {
    AttachmentsService,
} from '@/services/attachments.service';

import {
    createClient,
} from '@/lib/supabase/server';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export const dynamic = 'force-dynamic';

function formatFileSize(
    bytes?: number,
): string {
    if (
        bytes === undefined ||
        bytes === null ||
        !Number.isFinite(bytes) ||
        bytes < 0
    ) {
        return '-';
    }

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(
            bytes / 1024
        ).toFixed(1)} KB`;
    }

    if (bytes < 1024 * 1024 * 1024) {
        return `${(
            bytes /
            (1024 * 1024)
        ).toFixed(1)} MB`;
    }

    return `${(
        bytes /
        (1024 * 1024 * 1024)
    ).toFixed(1)} GB`;
}

function formatDate(
    value?: string,
): string {
    if (!value) {
        return '-';
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return '-';
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        },
    ).format(date);
}

export default async function AttachmentDetailsPage({
    params,
}: Props) {
    const {
        id,
    } = await params;

    if (!id?.trim()) {
        notFound();
    }

    const supabase =
        await createClient();

    const service =
        new AttachmentsService(
            supabase,
        );

    const attachment =
        await service.details(
            id,
        );

    if (!attachment) {
        notFound();
    }

    const isDeleted =
        attachment.isDeleted === true;

    const isArchived =
        attachment.archived === true;

    const status =
        isDeleted
            ? 'Deleted'
            : isArchived
                ? 'Archived'
                : 'Active';

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <div className="mb-2 text-sm text-muted-foreground">
                        <Link
                            href="/crm/attachments"
                            className="hover:underline"
                        >
                            Attachments
                        </Link>

                        {' / '}

                        {attachment.fileName}
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight">
                        {attachment.fileName}
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {attachment.entityType}
                        {' · '}
                        {attachment.entityId}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {!isDeleted && (
                        <Link
                            href={`/crm/attachments/${attachment.id}/edit`}
                            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                        >
                            Edit
                        </Link>
                    )}

                    {attachment.fileUrl &&
                        !isDeleted && (
                            <a
                                href={
                                    attachment.fileUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                            >
                                Open File
                            </a>
                        )}

                    <Link
                        href="/crm/attachments"
                        className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                        Back
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border p-5">
                    <div className="text-sm text-muted-foreground">
                        Status
                    </div>

                    <div className="mt-2 font-semibold">
                        {status}
                    </div>
                </div>

                <div className="rounded-xl border p-5">
                    <div className="text-sm text-muted-foreground">
                        File Size
                    </div>

                    <div className="mt-2 font-semibold">
                        {formatFileSize(
                            attachment.fileSize,
                        )}
                    </div>
                </div>

                <div className="rounded-xl border p-5">
                    <div className="text-sm text-muted-foreground">
                        File Type
                    </div>

                    <div className="mt-2 font-semibold">
                        {attachment.fileType ||
                            attachment.mimeType ||
                            '-'}
                    </div>
                </div>

                <div className="rounded-xl border p-5">
                    <div className="text-sm text-muted-foreground">
                        Version
                    </div>

                    <div className="mt-2 font-semibold">
                        {attachment.version ??
                            1}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <section className="rounded-xl border p-6">
                        <h2 className="text-lg font-semibold">
                            Attachment Details
                        </h2>

                        <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm text-muted-foreground">
                                    Entity Type
                                </dt>

                                <dd className="mt-1 font-medium">
                                    {
                                        attachment.entityType
                                    }
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-muted-foreground">
                                    Entity ID
                                </dt>

                                <dd className="mt-1 break-all font-mono text-sm">
                                    {
                                        attachment.entityId
                                    }
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-muted-foreground">
                                    File Name
                                </dt>

                                <dd className="mt-1 break-words font-medium">
                                    {
                                        attachment.fileName
                                    }
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-muted-foreground">
                                    MIME Type
                                </dt>

                                <dd className="mt-1 font-medium">
                                    {
                                        attachment.mimeType ??
                                        '-'
                                    }
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-muted-foreground">
                                    Uploaded
                                </dt>

                                <dd className="mt-1 font-medium">
                                    {formatDate(
                                        attachment.uploadedAt,
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-muted-foreground">
                                    Uploaded By
                                </dt>

                                <dd className="mt-1 break-all font-medium">
                                    {
                                        attachment.uploadedBy ??
                                        '-'
                                    }
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-muted-foreground">
                                    Created
                                </dt>

                                <dd className="mt-1 font-medium">
                                    {formatDate(
                                        attachment.createdAt,
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-muted-foreground">
                                    Updated
                                </dt>

                                <dd className="mt-1 font-medium">
                                    {formatDate(
                                        attachment.updatedAt,
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </section>

                    <section className="rounded-xl border p-6">
                        <h2 className="text-lg font-semibold">
                            Description
                        </h2>

                        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                            {attachment.description ||
                                'No description provided.'}
                        </p>
                    </section>
                </div>

                <aside className="space-y-6">
                    <section className="rounded-xl border p-6">
                        <h2 className="text-lg font-semibold">
                            Access
                        </h2>

                        <dl className="mt-5 space-y-4">
                            <div>
                                <dt className="text-sm text-muted-foreground">
                                    Preview
                                </dt>

                                <dd className="mt-1 font-medium">
                                    {attachment.previewAllowed
                                        ? 'Allowed'
                                        : 'Restricted'}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-muted-foreground">
                                    Download
                                </dt>

                                <dd className="mt-1 font-medium">
                                    {attachment.downloadAllowed
                                        ? 'Allowed'
                                        : 'Restricted'}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-muted-foreground">
                                    Storage Path
                                </dt>

                                <dd className="mt-1 break-all font-mono text-xs">
                                    {
                                        attachment.storagePath ??
                                        '-'
                                    }
                                </dd>
                            </div>
                        </dl>
                    </section>

                    <section className="rounded-xl border p-6">
                        <h2 className="text-lg font-semibold">
                            Record Information
                        </h2>

                        <dl className="mt-5 space-y-4">
                            <div>
                                <dt className="text-sm text-muted-foreground">
                                    Attachment ID
                                </dt>

                                <dd className="mt-1 break-all font-mono text-xs">
                                    {
                                        attachment.id
                                    }
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-muted-foreground">
                                    Entity Type
                                </dt>

                                <dd className="mt-1 font-medium">
                                    {
                                        attachment.entityType
                                    }
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-muted-foreground">
                                    Checksum
                                </dt>

                                <dd className="mt-1 break-all font-mono text-xs">
                                    {
                                        attachment.checksum ??
                                        '-'
                                    }
                                </dd>
                            </div>

                            {isDeleted &&
                                attachment.deletedAt && (
                                    <div>
                                        <dt className="text-sm text-muted-foreground">
                                            Deleted
                                        </dt>

                                        <dd className="mt-1 font-medium">
                                            {formatDate(
                                                attachment.deletedAt,
                                            )}
                                        </dd>
                                    </div>
                                )}
                        </dl>
                    </section>
                </aside>
            </div>
        </div>
    );
}
