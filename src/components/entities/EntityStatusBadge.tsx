interface EntityStatusBadgeProps {
    status: string;
}

const styles: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    PROSPECT: "bg-blue-100 text-blue-700",
    INACTIVE: "bg-gray-100 text-gray-700",
    ARCHIVED: "bg-red-100 text-red-700",

    active: "bg-green-100 text-green-700",
    prospect: "bg-blue-100 text-blue-700",
    inactive: "bg-gray-100 text-gray-700",
    archived: "bg-red-100 text-red-700",

    new: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    qualified: "bg-purple-100 text-purple-700",
    proposal: "bg-indigo-100 text-indigo-700",
    won: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700",
    converted: "bg-emerald-100 text-emerald-700",
};

export default function EntityStatusBadge({
    status,
}: EntityStatusBadgeProps) {
    const badgeClass =
        styles[status] ??
        "bg-gray-100 text-gray-700";

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}
        >
            {status}
        </span>
    );
}