import Link from "next/link";
import { notFound } from "next/navigation";

import {
    getProject,
} from "../actions";

import {
    EntityWorkspace,
} from "@/components/entities";

export default async function ProjectDetailsPage({
    params,
}: {
    params: Promise<{
        id: string;
    }>;
}) {

    const { id } =
        await params;

    const project =
        await getProject(id);

    if (!project) {
        notFound();
    }

    return (

        <EntityWorkspace

            entityType="project"

            entityId={project.id}

            overview={

                <div className="rounded-xl border bg-card p-6 space-y-6">

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

                    <div className="grid gap-4 md:grid-cols-2">

                        <Info
                            label="Customer"
                            value={project.customerName}
                        />

                        <Info
                            label="Company"
                            value={project.companyId}
                        />

                        <Info
                            label="Contract"
                            value={project.contractId || "-"}
                        />

                        <Info
                            label="Manager"
                            value={project.manager || "-"}
                        />

                        <Info
                            label="Status"
                            value={project.status}
                        />

                        <Info
                            label="Budget"
                            value={`${project.currency} ${project.budget.toLocaleString()}`}
                        />

                        <Info
                            label="Start"
                            value={project.startDate}
                        />

                        <Info
                            label="End"
                            value={project.endDate}
                        />

                    </div>

                    {project.description && (

                        <div>

                            <h2 className="mb-2 font-semibold">
                                Description
                            </h2>

                            <p className="whitespace-pre-wrap">
                                {project.description}
                            </p>

                        </div>

                    )}

                </div>

            }

            activities={[]}

            notes={[]}

            tasks={[]}

            attachments={[]}

            notifications={[]}

        />

    );

}

function Info({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {

    return (

        <div>

            <div className="text-sm text-muted-foreground">
                {label}
            </div>

            <div className="font-medium">
                {value}
            </div>

        </div>

    );

}