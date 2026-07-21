import {
    getTickets,
    getTicketsSummary,
} from '../actions';

function MetricCard({
    title,
    value,
}: {
    title: string;
    value: number;
}) {
    return (
        <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">
                {title}
            </p>

            <p className="mt-2 text-2xl font-bold">
                {value}
            </p>
        </div>
    );
}

export default async function TicketsDashboardPage() {

    const tickets =
        await getTickets();

    const summary =
        await getTicketsSummary();

    const assigned =
        tickets.filter(
            ticket => ticket.assignedTo
        ).length;

    const resolutionRate =
        summary.total === 0
            ? 0
            : Math.round(
                (
                    (summary.resolved + summary.closed) /
                    summary.total
                ) * 100
            );

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-semibold">
                    Tickets Dashboard
                </h1>

                <p className="text-sm text-muted-foreground">
                    Support performance and ticket metrics.
                </p>

            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">

                <MetricCard
                    title="Total"
                    value={summary.total}
                />

                <MetricCard
                    title="Open"
                    value={summary.open}
                />

                <MetricCard
                    title="In Progress"
                    value={summary.inProgress}
                />

                <MetricCard
                    title="Resolved"
                    value={summary.resolved}
                />

                <MetricCard
                    title="Closed"
                    value={summary.closed}
                />

                <MetricCard
                    title="Critical"
                    value={summary.critical}
                />

            </div>

            <div className="grid gap-4 md:grid-cols-2">

                <div className="rounded-lg border p-6">

                    <h2 className="font-semibold">
                        Resolution Rate
                    </h2>

                    <p className="mt-3 text-4xl font-bold">
                        {resolutionRate}%
                    </p>

                </div>

                <div className="rounded-lg border p-6">

                    <h2 className="font-semibold">
                        Assigned Tickets
                    </h2>

                    <p className="mt-3 text-4xl font-bold">
                        {assigned}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        Tickets assigned to agents
                    </p>

                </div>

            </div>

        </div>

    );

}