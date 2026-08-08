'use client';

import {
    useState,
    useTransition,
} from 'react';

import {
    useRouter,
} from 'next/navigation';

import AttachmentForm from './AttachmentForm';
import AttachmentTable from './AttachmentTable';
import AttachmentSummary from './AttachmentSummary';

import {
    createAttachment,
    deleteAttachment,
    restoreAttachment,
} from '@/app/crm/attachments/actions';

import type {
    Attachment,
} from '@/types/crm/Attachment';

interface Props {
    initialAttachments: Attachment[];
}

export default function AttachmentClient({
    initialAttachments,
}: Props) {
    const router =
        useRouter();

    const [
        isPending,
        startTransition,
    ] = useTransition();

    const [
        error,
        setError,
    ] = useState<string | null>(null);

    const [
        showCreateForm,
        setShowCreateForm,
    ] = useState(false);

    function handleCreate(
        values: Partial<Attachment>,
    ) {
        setError(null);

        startTransition(
            async () => {
                try {
                    await createAttachment(
                        values,
                    );

                    setShowCreateForm(
                        false,
                    );

                    router.refresh();
                } catch (cause) {
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : 'Failed to create attachment.',
                    );
                }
            },
        );
    }

    function handleDelete(
        attachment: Attachment,
    ) {
        setError(null);

        startTransition(
            async () => {
                try {
                    await deleteAttachment(
                        attachment.id,
                    );

                    router.refresh();
                } catch (cause) {
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : 'Failed to delete attachment.',
                    );
                }
            },
        );
    }

    function handleRestore(
        attachment: Attachment,
    ) {
        setError(null);

        startTransition(
            async () => {
                try {
                    const result =
                        await restoreAttachment(
                            attachment.id,
                        );

                    if (
                        !result.success
                    ) {
                        throw new Error(
                            'Attachment could not be restored.',
                        );
                    }

                    router.refresh();
                } catch (cause) {
                    setError(
                        cause instanceof Error
                            ? cause.message
                            : 'Failed to restore attachment.',
                    );
                }
            },
        );
    }

    const summary = {
        total:
            initialAttachments.length,

        active:
            initialAttachments.filter(
                attachment =>
                    !attachment.archived &&
                    !attachment.isDeleted,
            ).length,

        archived:
            initialAttachments.filter(
                attachment =>
                    attachment.archived &&
                    !attachment.isDeleted,
            ).length,

        deleted:
            initialAttachments.filter(
                attachment =>
                    attachment.isDeleted === true,
            ).length,

        storageUsed:
            initialAttachments.reduce(
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

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold">
                        Attachment Management
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Manage files attached to CRM entities.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setShowCreateForm(
                            value =>
                                !value,
                        )
                    }
                    disabled={isPending}
                    className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {showCreateForm
                        ? 'Cancel'
                        : 'Add Attachment'}
                </button>
            </div>

            {error && (
                <div
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                    {error}
                </div>
            )}

            <AttachmentSummary
                summary={summary}
            />

            {showCreateForm && (
                <AttachmentForm
                    loading={isPending}
                    onSubmit={
                        handleCreate
                    }
                    onCancel={() =>
                        setShowCreateForm(
                            false,
                        )
                    }
                />
            )}

            <AttachmentTable
                attachments={
                    initialAttachments
                }
                loading={isPending}
                onDelete={
                    handleDelete
                }
                onRestore={
                    handleRestore
                }
            />
        </div>
    );
}
