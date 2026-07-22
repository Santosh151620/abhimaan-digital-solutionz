interface CRMStatusBadgeProps {

    status: string;

}

const STATUS_CLASSES: Record<string, string> = {

    Active:
        'bg-green-100 text-green-700 border-green-200',

    ACTIVE:
        'bg-green-100 text-green-700 border-green-200',

    Available:
        'bg-green-100 text-green-700 border-green-200',

    Open:
        'bg-blue-100 text-blue-700 border-blue-200',

    Pending:
        'bg-amber-100 text-amber-700 border-amber-200',

    'In Progress':
        'bg-blue-100 text-blue-700 border-blue-200',

    Completed:
        'bg-green-100 text-green-700 border-green-200',

    Won:
        'bg-green-100 text-green-700 border-green-200',

    Paid:
        'bg-green-100 text-green-700 border-green-200',

    Draft:
        'bg-slate-100 text-slate-700 border-slate-200',

    Sent:
        'bg-cyan-100 text-cyan-700 border-cyan-200',

    Closed:
        'bg-slate-100 text-slate-700 border-slate-200',

    Cancelled:
        'bg-red-100 text-red-700 border-red-200',

    Lost:
        'bg-red-100 text-red-700 border-red-200',

    Overdue:
        'bg-red-100 text-red-700 border-red-200',

    Archived:
        'bg-gray-100 text-gray-700 border-gray-200',

};

export default function CRMStatusBadge({
    status,
}: CRMStatusBadgeProps) {

    const badgeClass =
        STATUS_CLASSES[status] ??
        'bg-slate-100 text-slate-700 border-slate-200';

    return (

        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass}`}
        >
            {status}
        </span>

    );

}