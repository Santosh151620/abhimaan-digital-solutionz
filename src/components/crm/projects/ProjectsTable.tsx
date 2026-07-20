'use client';

import Link from 'next/link';

import type {
    Project,
    ProjectStatus,
} from '@/types/crm/Projects';

interface Props {
    projects: Project[];
}

export default function ProjectsTable({
    projects,
}: Props) {

    if (projects.length === 0) {
        return (
            <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground">
                No projects found.
            </div>
        );
    }

    const badgeClasses: Record<
        ProjectStatus,
        string
    > = {

        Planning:
            'bg-slate-100 text-slate-700',

        Active:
            'bg-green-100 text-green-700',

        'On Hold':
            'bg-yellow-100 text-yellow-700',

        Completed:
            'bg-blue-100 text-blue-700',

        Cancelled:
            'bg-red-100 text-red-700',

    };

    return (

        <div className="overflow-x-auto rounded-xl border bg-card">

            <table className="min-w-full">

                <thead className="bg-muted/40">

                    <tr>

                        <th className="px-4 py-3 text-left">
                            Project
                        </th>

                        <th className="px-4 py-3 text-left">
                            Customer
                        </th>

                        <th className="px-4 py-3 text-left">
                            Manager
                        </th>

                        <th className="px-4 py-3 text-left">
                            Budget
                        </th>

                        <th className="px-4 py-3 text-left">
                            Status
                        </th>

                        <th className="px-4 py-3 text-left">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {projects.map((project) => (

                        <tr
                            key={project.id}
                            className="border-t hover:bg-muted/20"
                        >

                            <td className="px-4 py-3">

                                <div className="font-medium">
                                    {project.name}
                                </div>

                                <div className="text-xs text-muted-foreground">
                                    {project.projectNumber}
                                </div>

                            </td>

                            <td className="px-4 py-3">
                                {project.customerName}
                            </td>

                            <td className="px-4 py-3">
                                {project.manager || '-'}
                            </td>

                            <td className="px-4 py-3">
                                {project.currency}{' '}
                                {project.budget.toLocaleString()}
                            </td>

                            <td className="px-4 py-3">

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClasses[project.status]}`}
                                >
                                    {project.status}
                                </span>

                            </td>

                            <td className="px-4 py-3">

                                <div className="flex gap-2">

                                    <Link
                                        href={`/crm/projects/${project.id}`}
                                        className="rounded border px-3 py-1 text-sm hover:bg-muted"
                                    >
                                        View
                                    </Link>

                                    <Link
                                        href={`/crm/projects/${project.id}/edit`}
                                        className="rounded border px-3 py-1 text-sm hover:bg-muted"
                                    >
                                        Edit
                                    </Link>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}