import ProjectTable from "@/modules/projects/components/ProjectTable";
import { getProjects } from "@/modules/projects/services/projects";

export default async function ProjectsPage() {
    const data = await getProjects({
        page: 1,
        pageSize: 50,
    });

    return (
        <main
            aria-labelledby="projects-page-title"
            className="
                min-w-0
                space-y-6
                p-4
                sm:p-6
            "
        >
            {/* Page header */}
            <header>
                <h1
                    id="projects-page-title"
                    className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-white
                        sm:text-3xl
                    "
                >
                    Projects
                </h1>

                <p
                    className="
                        mt-1
                        max-w-3xl
                        text-sm
                        leading-6
                        text-slate-400
                    "
                >
                    Manage all client projects, timelines,
                    and delivery progress.
                </p>
            </header>

            {/* Projects */}
            <section
                aria-label="Projects list"
                className="min-w-0"
            >
                <ProjectTable
                    projects={data.projects}
                    totalProjects={data.total}
                    // Pagination remains intentionally disabled
                    // until the existing ProjectTable contract
                    // supports it end-to-end.
                />
            </section>
        </main>
    );
}