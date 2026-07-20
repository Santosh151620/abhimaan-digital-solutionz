import {
    notFound,
    redirect,
} from 'next/navigation';

import type {
    ProjectStatus,
} from '@/types/crm/Projects';

import ProjectsForm from '@/components/crm/projects/ProjectsForm';

import {
    getProject,
    updateProject,
} from '../../actions';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProjectPage({
    params,
}: Props) {

    const { id } =
        await params;

    const project =
        await getProject(id);

    if (!project) {
        notFound();
    }
const currentProject = project;

    async function submit(
        formData: FormData
    ) {
        'use server';

        await updateProject(
            id,
            {

                projectNumber: String(
                    formData.get('projectNumber') ?? ''
                ),

                name: String(
                    formData.get('name') ?? ''
                ),

                customerName: String(
                    formData.get('customerName') ?? ''
                ),

                companyId: String(
                    formData.get('companyId') ?? ''
                ),

                contractId: String(
                    formData.get('contractId') ?? ''
                ),

                manager: String(
                    formData.get('manager') ?? ''
                ),

                description: String(
                    formData.get('description') ?? ''
                ),

                status: String(
                    formData.get('status') ??
                    currentProject.status
                ) as ProjectStatus,

                startDate: String(
                    formData.get('startDate') ?? ''
                ),

                endDate: String(
                    formData.get('endDate') ?? ''
                ),

                budget: Number(
                    formData.get('budget') ?? 0
                ),

                currency: String(
                    formData.get('currency') ?? 'INR'
                ),

            }
        );

        redirect(
            `/crm/projects/${id}`
        );

    }

    return (

        <div className="space-y-6 p-6">

            <h1 className="text-3xl font-bold">
                Edit Project
            </h1>

            <ProjectsForm
                initialData={currentProject}
                action={submit}
            />

        </div>

    );

}