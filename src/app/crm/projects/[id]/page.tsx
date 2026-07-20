import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
    getProject,
} from '../actions';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProjectDetailsPage({
    params,
}: Props) {

    const { id } =
        await params;

    const project =
        await getProject(id);

    if (!project) {
        notFound();
    }

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        {project.name}
                    </h1>

                    <p className="text-muted-foreground">
                        {project.projectNumber}
                    </p>

                </div>

                <Link
                    href={`/crm/projects/${project.id}/edit`}
                    className="rounded-lg border px-4 py-2"
                >
                    Edit
                </Link>

            </div>

            <div className="grid gap-4 rounded-xl border bg-card p-6 md:grid-cols-2">

                <div>
                    <div className="text-sm text-muted-foreground">
                        Customer
                    </div>

                    <div className="font-medium">
                        {project.customerName}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Company
                    </div>

                    <div className="font-medium">
                        {project.companyId}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Contract
                    </div>

                    <div className="font-medium">
                        {project.contractId || '-'}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Manager
                    </div>

                    <div className="font-medium">
                        {project.manager || '-'}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Status
                    </div>

                    <div className="font-medium">
                        {project.status}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Budget
                    </div>

                    <div className="font-medium">
                        {project.currency}{" "}
                        {project.budget.toLocaleString()}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        Start Date
                    </div>

                    <div className="font-medium">
                        {project.startDate}
                    </div>
                </div>

                <div>
                    <div className="text-sm text-muted-foreground">
                        End Date
                    </div>

                    <div className="font-medium">
                        {project.endDate}
                    </div>
                </div>

            </div>

            {project.description && (

                <div className="rounded-xl border bg-card p-6">

                    <h2 className="mb-2 font-semibold">
                        Description
                    </h2>

                    <p className="whitespace-pre-wrap">
                        {project.description}
                    </p>

                </div>

            )}

        </div>

    );

}