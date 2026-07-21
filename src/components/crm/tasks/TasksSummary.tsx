interface Props {

    total: number;

    todo: number;

    inProgress: number;

    blocked: number;

    completed: number;

    cancelled: number;

    critical: number;

}

export default function TasksSummary({
    total,
    todo,
    inProgress,
    blocked,
    completed,
    cancelled,
    critical,
}: Props) {

    const cards = [

        {
            title: 'Total',
            value: total,
        },

        {
            title: 'Todo',
            value: todo,
        },

        {
            title: 'In Progress',
            value: inProgress,
        },

        {
            title: 'Blocked',
            value: blocked,
        },

        {
            title: 'Completed',
            value: completed,
        },

        {
            title: 'Cancelled',
            value: cancelled,
        },

        {
            title: 'Critical',
            value: critical,
        },

    ];

    return (

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">

            {cards.map(card => (

                <div
                    key={card.title}
                    className="rounded-xl border bg-background p-4"
                >

                    <p className="text-sm text-muted-foreground">
                        {card.title}
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        {card.value}
                    </p>

                </div>

            ))}

        </div>

    );

}