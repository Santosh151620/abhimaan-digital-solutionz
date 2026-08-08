'use client';

import {
    useState,
} from 'react';

import type {
    Attachment,
    AttachmentEntityType,
} from '@/types/crm/Attachment';

interface Props {
    initialValues?: Partial<Attachment>;
    loading?: boolean;
    onSubmit?: (
        values: Partial<Attachment>,
    ) => void | Promise<void>;
    onCancel?: () => void;
}

const entityTypes: AttachmentEntityType[] = [
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

function getFileType(
    fileName: string,
): string {
    const value =
        fileName.trim();

    const index =
        value.lastIndexOf('.');

    if (
        index < 0 ||
        index === value.length - 1
    ) {
        return 'file';
    }

    return value
        .slice(index + 1)
        .toLowerCase();
}

export default function AttachmentForm({
    initialValues,
    loading = false,
    onSubmit,
    onCancel,
}: Props) {
    const [form, setForm] =
        useState<Partial<Attachment>>({
            entityType: 'Other',
            previewAllowed: true,
            downloadAllowed: true,
            version: 1,
            ...initialValues,
        });

    const [error, setError] =
        useState<string | null>(null);

    function update<K extends keyof Attachment>(
        key: K,
        value: Attachment[K],
    ) {
        setForm(
            previous => ({
                ...previous,
                [key]: value,
            }),
        );
    }

    function handleFileNameChange(
        value: string,
    ) {
        setForm(
            previous => ({
                ...previous,
                fileName: value,
                fileType:
                    previous.fileType ||
                    getFileType(value),
            }),
        );
    }

    async function submit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setError(null);

        const fileName =
            form.fileName?.trim();

        const entityId =
            form.entityId?.trim();

        const fileUrl =
            form.fileUrl?.trim();

        if (!fileName) {
            setError(
                'File name is required.',
            );
            return;
        }

        if (!form.entityType) {
            setError(
                'Entity type is required.',
            );
            return;
        }

        if (!entityId) {
            setError(
                'Entity ID is required.',
            );
            return;
        }

        if (!fileUrl) {
            setError(
                'File URL is required.',
            );
            return;
        }

        try {
            await onSubmit?.({
                ...form,
                fileName,
                entityId,
                fileUrl,
                fileType:
                    form.fileType ||
                    getFileType(fileName),
            });
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : 'Unable to save attachment.',
            );
        }
    }

    return (
        <form
            onSubmit={submit}
            className="space-y-6 rounded-xl border p-6"
        >
            {error && (
                <div
                    role="alert"
                    className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                    {error}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="attachment-file-name"
                        className="mb-1 block text-sm font-medium"
                    >
                        File Name
                    </label>

                    <input
                        id="attachment-file-name"
                        type="text"
                        required
                        disabled={loading}
                        value={
                            form.fileName ?? ''
                        }
                        onChange={event =>
                            handleFileNameChange(
                                event.target.value,
                            )
                        }
                        placeholder="example.pdf"
                        className="w-full rounded-lg border bg-background p-2"
                    />
                </div>

                <div>
                    <label
                        htmlFor="attachment-file-type"
                        className="mb-1 block text-sm font-medium"
                    >
                        File Type
                    </label>

                    <input
                        id="attachment-file-type"
                        type="text"
                        disabled={loading}
                        value={
                            form.fileType ?? ''
                        }
                        onChange={event =>
                            update(
                                'fileType',
                                event.target.value,
                            )
                        }
                        placeholder="pdf"
                        className="w-full rounded-lg border bg-background p-2"
                    />
                </div>

                <div>
                    <label
                        htmlFor="attachment-entity-type"
                        className="mb-1 block text-sm font-medium"
                    >
                        Entity Type
                    </label>

                    <select
                        id="attachment-entity-type"
                        required
                        disabled={loading}
                        value={
                            form.entityType ??
                            'Other'
                        }
                        onChange={event =>
                            update(
                                'entityType',
                                event.target.value as AttachmentEntityType,
                            )
                        }
                        className="w-full rounded-lg border bg-background p-2"
                    >
                        {entityTypes.map(type => (
                            <option
                                key={type}
                                value={type}
                            >
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="attachment-entity-id"
                        className="mb-1 block text-sm font-medium"
                    >
                        Entity ID
                    </label>

                    <input
                        id="attachment-entity-id"
                        type="text"
                        required
                        disabled={loading}
                        value={
                            form.entityId ?? ''
                        }
                        onChange={event =>
                            update(
                                'entityId',
                                event.target.value,
                            )
                        }
                        placeholder="Entity UUID"
                        className="w-full rounded-lg border bg-background p-2"
                    />
                </div>

                <div className="md:col-span-2">
                    <label
                        htmlFor="attachment-file-url"
                        className="mb-1 block text-sm font-medium"
                    >
                        File URL
                    </label>

                    <input
                        id="attachment-file-url"
                        type="url"
                        required
                        disabled={loading}
                        value={
                            form.fileUrl ?? ''
                        }
                        onChange={event =>
                            update(
                                'fileUrl',
                                event.target.value,
                            )
                        }
                        placeholder="https://..."
                        className="w-full rounded-lg border bg-background p-2"
                    />
                </div>

                <div>
                    <label
                        htmlFor="attachment-storage-path"
                        className="mb-1 block text-sm font-medium"
                    >
                        Storage Path
                    </label>

                    <input
                        id="attachment-storage-path"
                        type="text"
                        disabled={loading}
                        value={
                            form.storagePath ?? ''
                        }
                        onChange={event =>
                            update(
                                'storagePath',
                                event.target.value,
                            )
                        }
                        placeholder="attachments/..."
                        className="w-full rounded-lg border bg-background p-2"
                    />
                </div>

                <div>
                    <label
                        htmlFor="attachment-mime-type"
                        className="mb-1 block text-sm font-medium"
                    >
                        MIME Type
                    </label>

                    <input
                        id="attachment-mime-type"
                        type="text"
                        disabled={loading}
                        value={
                            form.mimeType ?? ''
                        }
                        onChange={event =>
                            update(
                                'mimeType',
                                event.target.value,
                            )
                        }
                        placeholder="application/pdf"
                        className="w-full rounded-lg border bg-background p-2"
                    />
                </div>

                <div>
                    <label
                        htmlFor="attachment-file-size"
                        className="mb-1 block text-sm font-medium"
                    >
                        File Size (bytes)
                    </label>

                    <input
                        id="attachment-file-size"
                        type="number"
                        min={0}
                        disabled={loading}
                        value={
                            form.fileSize ?? ''
                        }
                        onChange={event =>
                            update(
                                'fileSize',
                                event.target.value
                                    ? Number(
                                        event.target.value,
                                    )
                                    : undefined,
                            )
                        }
                        placeholder="0"
                        className="w-full rounded-lg border bg-background p-2"
                    />
                </div>

                <div>
                    <label
                        htmlFor="attachment-version"
                        className="mb-1 block text-sm font-medium"
                    >
                        Version
                    </label>

                    <input
                        id="attachment-version"
                        type="number"
                        min={1}
                        disabled={loading}
                        value={
                            form.version ?? 1
                        }
                        onChange={event =>
                            update(
                                'version',
                                Math.max(
                                    1,
                                    Number(
                                        event.target.value ||
                                        1,
                                    ),
                                ),
                            )
                        }
                        className="w-full rounded-lg border bg-background p-2"
                    />
                </div>

                <div className="md:col-span-2">
                    <label
                        htmlFor="attachment-description"
                        className="mb-1 block text-sm font-medium"
                    >
                        Description
                    </label>

                    <textarea
                        id="attachment-description"
                        rows={4}
                        disabled={loading}
                        value={
                            form.description ?? ''
                        }
                        onChange={event =>
                            update(
                                'description',
                                event.target.value,
                            )
                        }
                        placeholder="Optional attachment description..."
                        className="w-full rounded-lg border bg-background p-2"
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-6 rounded-lg border bg-muted/20 p-4">
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        disabled={loading}
                        checked={
                            form.previewAllowed ??
                            true
                        }
                        onChange={event =>
                            update(
                                'previewAllowed',
                                event.target.checked,
                            )
                        }
                    />

                    Allow preview
                </label>

                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        disabled={loading}
                        checked={
                            form.downloadAllowed ??
                            true
                        }
                        onChange={event =>
                            update(
                                'downloadAllowed',
                                event.target.checked,
                            )
                        }
                    />

                    Allow download
                </label>
            </div>

            <div className="flex justify-end gap-3">
                {onCancel && (
                    <button
                        type="button"
                        disabled={loading}
                        onClick={onCancel}
                        className="rounded border px-4 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? 'Saving...'
                        : 'Save Attachment'}
                </button>
            </div>
        </form>
    );
}
