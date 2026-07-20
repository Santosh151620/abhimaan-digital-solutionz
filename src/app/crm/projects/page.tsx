import Link from 'next/link';

import {
    getProjects,
} from './actions';

import ProjectsClient from './ProjectsClient';

export default async function ProjectsPage() {

    const projects =
        await getProjects();

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Projects
                    </h1>

                    <p className="text-muted-foreground">
                        Manage customer projects.
                    </p>

                </div>

                <Link
                    href="/crm/projects/new"
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                >
                    New Project
                </Link>

            </div>

            <ProjectsClient
                initialProjects={projects}
            />

        </div>

    );

}