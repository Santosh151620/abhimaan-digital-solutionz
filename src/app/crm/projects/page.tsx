import {
    getProjects,
} from './actions';

import ProjectsClient from './ProjectsClient';

export default async function ProjectsPage() {

    const projectsResult =
        await getProjects();

    return (
        <ProjectsClient
            initialProjects={
                projectsResult.projects
            }
        />
    );

}
