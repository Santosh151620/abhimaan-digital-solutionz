import ProjectTable from "@/components/dashboard/ProjectTable";
import ProjectModal from "@/components/dashboard/ProjectModal";
import ProjectForm from "@/components/dashboard/ProjectForm";

import { getProjects } from "@/services/projects";

export default async function ProjectsPage() {
  const data = await getProjects({
    page: 1,
    pageSize: 50,
  });

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Projects
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Manage all client projects, timelines, and delivery progress
        </p>
      </div>

      {/* TABLE WRAPPER */}
      <ProjectTable
        projects={data.projects}
        totalProjects={data.total}
        currentPage={data.page}
        totalPages={data.totalPages}
      />

    </div>
  );
}
"use client";

import { useState } from "react";

import ProjectTable from "@/components/dashboard/ProjectTable";
import ProjectModal from "@/components/dashboard/ProjectModal";
import ProjectForm from "@/components/dashboard/ProjectForm";

import type { Project } from "@/types/project";

import { getProjects } from "@/services/projects";
import { updateProject } from "@/services/projects";

export default function ProjectsPageClient({
  initialData,
}: {
  initialData: {
    projects: Project[];
    total: number;
    page: number;
    totalPages: number;
  };
}) {
  const [projects, setProjects] = useState<Project[]>(
    initialData.projects
  );

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [showModal, setShowModal] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [editingProject, setEditingProject] =
    useState<Project | null>(null);

  async function handleUpdate(
    projectId: string,
    updates: Partial<Project>
  ) {
    const updated = await updateProject(
      projectId,
      updates
    );

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? updated : p
      )
    );
  }

  function handleOpenProject(project: Project) {
    setSelectedProject(project);
    setShowModal(true);
  }

  function handleEditProject(project: Project) {
    setEditingProject(project);
    setShowForm(true);
  }

  function handleFormSuccess() {
    setShowForm(false);
  }

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Projects
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Manage all client projects, timelines, and delivery progress
        </p>
      </div>

      {/* TABLE */}
      <ProjectTable
        projects={projects}
        totalProjects={projects.length}
        currentPage={1}
        totalPages={1}
        onOpenProject={handleOpenProject}
        onEditProject={handleEditProject}
      />

      {/* MODAL */}
      <ProjectModal
        project={selectedProject}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onUpdate={handleUpdate}
      />

      {/* FORM */}
      {showForm && (
        <ProjectForm
          project={editingProject}
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

    </div>
  );
}