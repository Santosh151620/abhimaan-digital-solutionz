import {
    createClient,
} from "@/lib/supabase/server";


import {
    ProjectsRepository,
    type ProjectListQuery,
} from "@/repositories/crm/ProjectsRepository";


import type {
    Project,
    ProjectStatus,
} from "@/types/crm/Projects";



class ProjectsService {


    protected async repository() {

        const supabase =
            await createClient();


        return new ProjectsRepository(
            supabase,
        );

    }



    async list(): Promise<Project[]> {

        const repository =
            await this.repository();


        return repository.findAll();

    }



    async listPaginated(
        filters: ProjectListQuery = {},
    ) {

        const repository =
            await this.repository();


        return repository.findPaginated(
            filters,
        );

    }



    async listArchived(): Promise<Project[]> {

        const repository =
            await this.repository();


        return repository.listArchived();

    }



    async details(
        id: string,
    ): Promise<Project | null> {

        if (!id) {

            throw new Error(
                "Project id is required",
            );

        }


        const repository =
            await this.repository();


        return repository.findById(
            id,
        );

    }



    async create(
        data: Partial<Project>,
    ): Promise<Project> {

        const repository =
            await this.repository();


        return repository.create(
            data,
        );

    }



    async update(
        id: string,
        data: Partial<Project>,
    ): Promise<Project> {

        if (!id) {

            throw new Error(
                "Project id is required",
            );

        }


        const repository =
            await this.repository();


        return repository.update(
            id,
            data,
        );

    }



    async restore(
        id: string,
    ): Promise<Project> {

        if (!id) {

            throw new Error(
                "Project id is required",
            );

        }


        const repository =
            await this.repository();


        return repository.restore(
            id,
        );

    }



    async updateStatus(
        id: string,
        status: ProjectStatus,
    ): Promise<Project> {

        if (!id) {

            throw new Error(
                "Project id is required",
            );

        }


        const repository =
            await this.repository();


        return repository.update(
            id,
            {
                status,
            },
        );

    }



    async delete(
        id: string,
    ): Promise<void> {

        if (!id) {

            throw new Error(
                "Project id is required",
            );

        }


        const repository =
            await this.repository();


        return repository.delete(
            id,
        );

    }



    async summary() {

        const repository =
            await this.repository();


        return repository.summary();

    }

}



export const ProjectsServiceInstance =
    new ProjectsService();



/**
 * Legacy factory compatibility.
 *
 * Existing callers that explicitly provide a Supabase client
 * continue to work without changing the canonical service instance.
 */
export function createProjectsService(
    supabase: Parameters<
        typeof createProjectsServiceInternal
    >[0],
): ProjectsService {

    return createProjectsServiceInternal(
        supabase,
    );

}


function createProjectsServiceInternal(
    supabase: ConstructorParameters<
        typeof ProjectsRepository
    >[0],
): ProjectsService {

    return new ProjectsServiceWithRepository(
        new ProjectsRepository(
            supabase,
        ),
    ) as unknown as ProjectsService;

}



/**
 * Compatibility implementation for callers using the
 * explicit repository/factory path.
 */
class ProjectsServiceWithRepository
    extends ProjectsService {

    constructor(
        private readonly injectedRepository:
            ProjectsRepository,
    ) {

        super();

    }


    protected override async repository() {

        return this.injectedRepository;

    }

}




