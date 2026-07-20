'use client';

import Link from 'next/link';

import type {
    Project,
} from '@/types/crm/Projects';

interface Props {

    initialProjects: Project[];

}

export default function ProjectsClient({

    initialProjects,

}: Props) {

    return (

        <div className="space-y-4">

            <div className="flex items-center justify-between">

                <h2 className="font-semibold">
                    Project List
                </h2>

                <span className="text-sm text-muted-foreground">

                    {initialProjects.length} records

                </span>

            </div>

            <div className="space-y-3">

                {

                    initialProjects.length === 0 && (

                        <div className="rounded-lg border p-6 text-center text-muted-foreground">

                            No projects found.

                        </div>

                    )

                }

                {

                    initialProjects.map(

                        project => (

                            <div

                                key={project.id}

                                className="rounded-lg border p-4"

                            >

                                <div className="flex items-start justify-between">

                                    <div>

                                        <Link

                                            href={`/crm/projects/${project.id}`}

                                            className="font-semibold hover:underline"

                                        >

                                            {project.name}

                                        </Link>

                                        <p className="text-sm text-muted-foreground">

                                            {project.projectNumber}

                                        </p>

                                    </div>

                                    <span className="text-sm">

                                        {project.status}

                                    </span>

                                </div>

                                <div className="mt-4 grid gap-2 text-sm md:grid-cols-4">

                                    <div>

                                        Customer

                                        <div className="font-medium">

                                            {project.customerName}

                                        </div>

                                    </div>

                                    <div>

                                        Budget

                                        <div className="font-medium">

                                            {project.currency} {project.budget.toLocaleString()}

                                        </div>

                                    </div>

                                    <div>

                                        Start

                                        <div className="font-medium">

                                            {project.startDate}

                                        </div>

                                    </div>

                                    <div>

                                        End

                                        <div className="font-medium">

                                            {project.endDate}

                                        </div>

                                    </div>

                                </div>

                            </div>

                        )

                    )

                }

            </div>

        </div>

    );

}