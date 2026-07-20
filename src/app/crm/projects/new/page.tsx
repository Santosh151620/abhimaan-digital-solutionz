import { redirect } from 'next/navigation';

import ProjectsForm from '@/components/crm/projects/ProjectsForm';

import {
    createProject,
} from '../actions';

import type {
    ProjectStatus,
} from '@/types/crm/Projects';

export default function NewProjectPage() {

    async function submit(
        formData: FormData
    ) {
        'use server';

        const project =
            await createProject({

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
                    formData.get('status') ?? 'Planning'
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

            });

        redirect(
            `/crm/projects/${project.id}`
        );

    }

    return (

        <div className="space-y-6 p-6">

            <h1 className="text-3xl font-bold">
                New Project
            </h1>

            <ProjectsForm
                action={submit}
            />

        </div>

    );

}