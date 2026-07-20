'use client';

import type {
    Project,
} from '@/types/crm/Projects';

interface Props {
    projects: Project[];
}

export default function ProjectsSummary({
    projects,
}: Props) {

    const totalProjects =
        projects.length;

    const planningProjects =
        projects.filter(
            (project) =>
                project.status ===
                'Planning'
        ).length;

    const activeProjects =
        projects.filter(
            (project) =>
                project.status ===
                'Active'
        ).length;

    const onHoldProjects =
        projects.filter(
            (project) =>
                project.status ===
                'On Hold'
        ).length;

    const completedProjects =
        projects.filter(
            (project) =>
                project.status ===
                'Completed'
        ).length;

    const cancelledProjects =
        projects.filter(
            (project) =>
                project.status ===
                'Cancelled'
        ).length;

    const totalBudget =
        projects.reduce(
            (
                sum,
                project,
            ) =>
                sum +
                project.budget,
            0
        );

    return (

        <div className="grid gap-4 md:grid-cols-7">

            <div className="rounded-xl border bg-card p-5">

                <div className="text-sm text-muted-foreground">
                    Total
                </div>

                <div className="mt-2 text-3xl font-bold">
                    {totalProjects}
                </div>

            </div>

            <div className="rounded-xl border bg-card p-5">

                <div className="text-sm text-muted-foreground">
                    Planning
                </div>

                <div className="mt-2 text-3xl font-bold text-slate-600">
                    {planningProjects}
                </div>

            </div>

            <div className="rounded-xl border bg-card p-5">

                <div className="text-sm text-muted-foreground">
                    Active
                </div>

                <div className="mt-2 text-3xl font-bold text-green-600">
                    {activeProjects}
                </div>

            </div>

            <div className="rounded-xl border bg-card p-5">

                <div className="text-sm text-muted-foreground">
                    On Hold
                </div>

                <div className="mt-2 text-3xl font-bold text-yellow-600">
                    {onHoldProjects}
                </div>

            </div>

            <div className="rounded-xl border bg-card p-5">

                <div className="text-sm text-muted-foreground">
                    Completed
                </div>

                <div className="mt-2 text-3xl font-bold text-blue-600">
                    {completedProjects}
                </div>

            </div>

            <div className="rounded-xl border bg-card p-5">

                <div className="text-sm text-muted-foreground">
                    Cancelled
                </div>

                <div className="mt-2 text-3xl font-bold text-red-600">
                    {cancelledProjects}
                </div>

            </div>

            <div className="rounded-xl border bg-card p-5">

                <div className="text-sm text-muted-foreground">
                    Total Budget
                </div>

                <div className="mt-2 text-2xl font-bold">
                    {totalBudget.toLocaleString(
                        'en-IN',
                        {
                            style: 'currency',
                            currency: 'INR',
                        }
                    )}
                </div>

            </div>

        </div>

    );

}