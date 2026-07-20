import Link from 'next/link';

import ProjectsSummary from '@/components/crm/projects/ProjectsSummary';
import ProjectsTable from '@/components/crm/projects/ProjectsTable';

import {
    getProjects,
} from './actions';

export default async function ProjectsPage() {

    const projects =
        await getProjects();

    return (

        <div className="space-y-8 p-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Projects
                    </h1>

                    <p className="text-muted-foreground">
                        Manage customer projects and delivery.
                    </p>

                </div>

                <Link
                    href="/crm/projects/new"
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    + New Project
                </Link>

            </div>

            <ProjectsSummary
                projects={projects}
            />

            <ProjectsTable
                projects={projects}
            />

        </div>

    );

}