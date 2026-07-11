import Link from "next/link";

interface EntityActionBarProps {
    viewHref?: string;
    editHref?: string;
    onDelete?: () => void;
    showDelete?: boolean;
}

export default function EntityActionBar({
    viewHref,
    editHref,
    onDelete,
    showDelete = true,
}: EntityActionBarProps) {
    return (
        <div className="flex items-center gap-2">
            {viewHref && (
                <Link
                    href={viewHref}
                    className="rounded border px-3 py-1 text-sm hover:bg-muted"
                >
                    View
                </Link>
            )}

            {editHref && (
                <Link
                    href={editHref}
                    className="rounded border px-3 py-1 text-sm hover:bg-muted"
                >
                    Edit
                </Link>
            )}

            {showDelete && (
                <button
                    type="button"
                    onClick={onDelete}
                    className="rounded border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                    Delete
                </button>
            )}
        </div>
    );
}