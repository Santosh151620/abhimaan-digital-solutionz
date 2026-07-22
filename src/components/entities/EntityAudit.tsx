"use client";

interface EntityAuditProps {
    entries: Array<{
        id: string;
        action: string;
        createdAt: string;
        user?: string;
    }>;
}

export default function EntityAudit({
    entries,
}: EntityAuditProps) {

    if (entries.length === 0) {
        return (
            <div className="rounded-lg border p-4 text-sm text-gray-500">
                No audit records available.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {entries.map((entry) => (
                <div
                    key={entry.id}
                    className="rounded-lg border p-4"
                >
                    <div className="font-medium">
                        {entry.action}
                    </div>

                    {entry.user && (
                        <div className="mt-1 text-sm text-gray-600">
                            {entry.user}
                        </div>
                    )}

                    <div className="mt-2 text-xs text-gray-400">
                        {entry.createdAt}
                    </div>
                </div>
            ))}
        </div>
    );
}