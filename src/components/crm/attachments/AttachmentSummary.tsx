import type {
    AttachmentSummary as AttachmentSummaryData,
} from '@/types/crm/Attachment';

interface Props {
    summary: AttachmentSummaryData;
}

function formatStorage(
    bytes?: number,
): string {
    if (
        bytes === undefined ||
        bytes === null ||
        !Number.isFinite(bytes) ||
        bytes < 0
    ) {
        return '0 B';
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

export default function AttachmentSummary({
    summary,
}: Props) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border p-5">
                <div className="text-sm text-muted-foreground">
                    Total
                </div>

                <div className="mt-1 text-2xl font-semibold">
                    {summary.total}
                </div>
            </div>

            <div className="rounded-xl border p-5">
                <div className="text-sm text-muted-foreground">
                    Active
                </div>

                <div className="mt-1 text-2xl font-semibold">
                    {summary.active}
                </div>
            </div>

            <div className="rounded-xl border p-5">
                <div className="text-sm text-muted-foreground">
                    Archived / Deleted
                </div>

                <div className="mt-1 text-2xl font-semibold">
                    {(summary.archived ?? 0) +
                        (summary.deleted ?? 0)}
                </div>

                <div className="mt-1 text-xs text-muted-foreground">
                    Archived: {summary.archived ?? 0}
                    {' · '}
                    Deleted: {summary.deleted ?? 0}
                </div>
            </div>

            <div className="rounded-xl border p-5">
                <div className="text-sm text-muted-foreground">
                    Storage Used
                </div>

                <div className="mt-1 text-2xl font-semibold">
                    {formatStorage(
                        summary.storageUsed,
                    )}
                </div>
            </div>
        </div>
    );
}
