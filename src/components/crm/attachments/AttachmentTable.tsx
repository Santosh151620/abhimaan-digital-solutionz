'use client';

import Link from 'next/link';

import type {
    Attachment,
} from '@/types/crm/Attachment';

interface Props {
    attachments: Attachment[];
    loading?: boolean;
    onDelete?: (
        attachment: Attachment,
    ) => void | Promise<void>;
    onRestore?: (
        attachment: Attachment,
    ) => void | Promise<void>;
}

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
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    if (bytes < 1024 * 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
        },
    ).format(date);
}

export default function AttachmentTable({
    attachments,
    loading = false,
    onDelete,
    onRestore,
}: Props) {
    if (loading) {
        return (
            <div
                className="rounded-xl border"
                aria-busy="true"
                aria-live="polite"
            >
                <div className="p-6 text-sm text-muted-foreground">
                    Loading attachments...
                </div>
            </div>
        );
    }

    if (!attachments.length) {
        return (
            <div className="rounded-xl border">
                <div className="p-10 text-center">
                    <h3 className="text-base font-semibold">
                        No attachments found
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Attachments will appear here once they are created.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <caption className="sr-only">
                        CRM attachments
                    </caption>

                    <thead className="border-b bg-muted/40">
                        <tr>
                            <th
                                scope="col"
                                className="px-4 py-3 text-left font-medium"
                            >
                                File
                            </th>

                            <th
                                scope="col"
                                className="px-4 py-3 text-left font-medium"
                            >
                                Entity
                            </th>

                            <th
                                scope="col"
                                className="px-4 py-3 text-left font-medium"
                            >
                                Type
                            </th>

                            <th
                                scope="col"
                                className="px-4 py-3 text-left font-medium"
                            >
                                Size
                            </th>

                            <th
                                scope="col"
                                className="px-4 py-3 text-left font-medium"
                            >
                                Uploaded
                            </th>

                            <th
                                scope="col"
                                className="px-4 py-3 text-left font-medium"
                            >
                                Status
                            </th>

                            <th
                                scope="col"
                                className="px-4 py-3 text-right font-medium"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {attachments.map(
                            attachment => {
                                const deleted =
                                    attachment.isDeleted === true;

                                const archived =
                                    attachment.archived === true;

                                const status =
                                    deleted
                                        ? 'Deleted'
                                        : archived
                                            ? 'Archived'
                                            : 'Active';

                                return (
                                    <tr
                                        key={attachment.id}
                                        className="hover:bg-muted/20"
                                    >
                                        <td className="max-w-xs px-4 py-4">
                                            <div
                                                className="truncate font-medium"
                                                title={
                                                    attachment.fileName
                                                }
                                            >
                                                {
                                                    attachment.fileName
                                                }
                                            </div>

                                            {attachment.description && (
                                                <div
                                                    className="mt-1 truncate text-xs text-muted-foreground"
                                                    title={
                                                        attachment.description
                                                    }
                                                >
                                                    {
                                                        attachment.description
                                                    }
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="font-medium">
                                                {
                                                    attachment.entityType
                                                }
                                            </div>

                                            <div
                                                className="mt-1 max-w-[180px] truncate font-mono text-xs text-muted-foreground"
                                                title={
                                                    attachment.entityId
                                                }
                                            >
                                                {
                                                    attachment.entityId
                                                }
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div>
                                                {
                                                    attachment.fileType ||
                                                    attachment.mimeType ||
                                                    '-'
                                                }
                                            </div>

                                            {attachment.mimeType &&
                                                attachment.fileType &&
                                                attachment.mimeType !==
                                                    attachment.fileType && (
                                                    <div className="mt-1 text-xs text-muted-foreground">
                                                        {
                                                            attachment.mimeType
                                                        }
                                                    </div>
                                                )}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4">
                                            {
                                                formatFileSize(
                                                    attachment.fileSize,
                                                )
                                            }
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4">
                                            {
                                                formatDate(
                                                    attachment.uploadedAt,
                                                )
                                            }
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={
                                                    deleted
                                                        ? 'rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive'
                                                        : archived
                                                            ? 'rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground'
                                                            : 'rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium'
                                                }
                                            >
                                                {status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/crm/attachments/${attachment.id}`}
                                                    className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                >
                                                    View
                                                </Link>

                                                {!deleted && (
                                                    <Link
                                                        href={`/crm/attachments/${attachment.id}/edit`}
                                                        className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}

                                                {deleted || archived ? (
                                                    onRestore && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                void onRestore(
                                                                    attachment,
                                                                )
                                                            }
                                                            aria-label={`Restore ${attachment.fileName}`}
                                                            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                        >
                                                            Restore
                                                        </button>
                                                    )
                                                ) : (
                                                    onDelete && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                void onDelete(
                                                                    attachment,
                                                                )
                                                            }
                                                            aria-label={`Delete ${attachment.fileName}`}
                                                            className="rounded-md border px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                        >
                                                            Delete
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            },
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
