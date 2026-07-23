import {
    getTickets,
    getTicketsSummary,
} from '../actions';

export default async function TicketsReportsPage() {

    const tickets =
        await getTickets();

    const summary =
        await getTicketsSummary();

    const resolutionRate =
        summary.total === 0
            ? 0
            : Math.round(
                (
                    (summary.resolved + summary.closed) /
                    summary.total
                ) * 100
            );

    const assignmentRate =
        summary.total === 0
            ? 0
            : Math.round(
                (
                    tickets.filter(
                        ticket => ticket.assignedTo,
                    ).length /
                    summary.total
                ) * 100
            );

    const criticalOpen =
        tickets.filter(
            ticket =>
                ticket.priority === 'Critical' &&
                ticket.status !== 'Closed',
        ).length;

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-semibold">
                    Ticket Reports
                </h1>

                <p className="text-sm text-muted-foreground">
                    Operational support metrics.
                </p>

            </div>

            <div className="grid gap-4 md:grid-cols-3">

                <MetricCard
                    title="Resolution Rate"
                    value={`${resolutionRate}%`}
                />

                <MetricCard
                    title="Assignment Rate"
                    value={`${assignmentRate}%`}
                />

                <MetricCard
                    title="Critical Open"
                    value={criticalOpen}
                />

            </div>

            <div className="grid gap-4 md:grid-cols-2">

                <MetricCard
                    title="Open Tickets"
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

            </div>

        </div>

    );

}

function MetricCard({
    title,
    value,
}: {
    title: string;
    value: string | number;
}) {

    return (

        <div className="rounded-lg border p-5">

            <div className="text-sm text-muted-foreground">
                {title}
            </div>

            <div className="mt-2 text-3xl font-bold">
                {value}
            </div>

        </div>

    );

}
