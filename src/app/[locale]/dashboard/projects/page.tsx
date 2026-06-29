import ProjectTable from "@/components/dashboard/ProjectTable";
import { getProjects } from "@/services/projects";

export default async function ProjectsPage() {
  const data = await getProjects({
    page: 1,
    pageSize: 50,
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Projects
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Manage all client projects, timelines, and delivery progress
        </p>
      </div>

      <ProjectTable
        projects={data.projects}
        totalProjects={data.total}
        currentPage={data.page}
        totalPages={data.totalPages}
      />
    </div>
  );
}