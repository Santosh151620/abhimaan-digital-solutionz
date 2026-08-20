"use client";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    ProjectRepository,
} from "@/modules/projects/repositories/project.repository";

import type {
    Project,
    ProjectCreateInput,
    ProjectUpdateInput,
} from "@/modules/projects/types/project";

const PROJECTS_QUERY_KEY = ["crm-projects"] as const;

const projectQueryKey = (id: string) =>
    ["crm-project", id] as const;

export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            data: ProjectCreateInput,
        ): Promise<Project> =>
            ProjectRepository.create(data),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: PROJECTS_QUERY_KEY,
            });
        },
    });
}

export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: ProjectUpdateInput;
        }): Promise<Project> =>
            ProjectRepository.update(id, data),

        onSuccess: async (
            updatedProject,
            variables,
        ) => {
            queryClient.setQueryData<Project>(
                projectQueryKey(variables.id),
                updatedProject,
            );

            await queryClient.invalidateQueries({
                queryKey: PROJECTS_QUERY_KEY,
            });
        },
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            id: string,
        ): Promise<{ success: boolean }> =>
            ProjectRepository.remove(id),

        onSuccess: async (_, id) => {
            queryClient.removeQueries({
                queryKey: projectQueryKey(id),
            });

            await queryClient.invalidateQueries({
                queryKey: PROJECTS_QUERY_KEY,
            });
        },
    });
}