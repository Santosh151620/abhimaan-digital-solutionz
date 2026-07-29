import type {
    Project,
    ProjectStatus,
    ProjectSummary,
    ProjectSearchFilters,
} from '@/types/crm/Projects';

class ProjectsRepository {

    private projects =
        new Map<string, Project>();

    list() {

        return [
            ...this.projects.values(),
        ]
            .filter(project => !project.archived)
            .sort(
                (a, b) =>
                    b.createdAt.localeCompare(
                        a.createdAt,
                    ),
            );

    }

    listArchived() {

        return [
            ...this.projects.values(),
        ]
            .filter(project => project.archived)
            .sort(
                (a, b) =>
                    b.updatedAt.localeCompare(
                        a.updatedAt,
                    ),
            );

    }

    details(
        id: string
    ) {

        return (
            this.projects.get(id) ??
            null
        );

    }
    findById(
        id: string,
    ): Project | null {

        return this.details(id);

    }
    create(
        data: Partial<Project>
    ): Project {

        const now =
            new Date().toISOString();
        const project: Project = {
            id: crypto.randomUUID(),
            projectNumber:
                data.projectNumber ??
                `PRJ-${Date.now()}`,
            companyId: data.companyId ?? '',
            contractId: data.contractId,
            customerName:
                data.customerName ?? '',
            name:
                data.name ?? '',
            description:
                data.description,
            status:
                data.status ??
                'Planning',
            startDate:
                data.startDate ?? '',
            endDate:
                data.endDate ?? '',
            budget:
                data.budget ?? 0,
            currency:
                data.currency ?? 'INR',
            manager:
                data.manager,
            archived:
                false,
            createdAt:
                now,
            updatedAt:
                now,
        };

        this.projects.set(
            project.id,
            project
        );

        return project;

    }
    search(
        filters?: ProjectSearchFilters,
    ): Project[] {

        return ProjectsRepositoryInstance.search(
            filters,
        );

    }
    update(
        id: string,
        data: Partial<Project>
    ): Project | null {

        const existing =
            this.projects.get(id);

        if (!existing) {
            return null;
        }

        const updated: Project = {

            ...existing,

            ...data,

            updatedAt:
                new Date().toISOString(),

        };

        this.projects.set(
            id,
            updated
        );

        return updated;

    }

    updateStatus(
        id: string,
        status: ProjectStatus
    ) {

        return this.update(
            id,
            {
                status,
            }
        );

    }

    delete(
        id: string
    ): boolean {

        const existing =
            this.projects.get(id);

        if (!existing) {
            return false;
        }

        existing.archived =
            true;

        existing.updatedAt =
            new Date().toISOString();

        this.projects.set(
            id,
            existing
        );

        return true;

    }

    restore(
        id: string
    ): boolean {

        const existing =
            this.projects.get(id);

        if (!existing) {
            return false;
        }

        existing.archived =
            false;

        existing.updatedAt =
            new Date().toISOString();

        this.projects.set(
            id,
            existing
        );

        return true;

    }

    summary(): ProjectSummary {

        const projects =
            this.list();

        return {

            total:
                projects.length,

            planning:
                projects.filter(
                    p =>
                        p.status ===
                        'Planning'
                ).length,

            active:
                projects.filter(
                    p =>
                        p.status ===
                        'Active'
                ).length,

            onHold:
                projects.filter(
                    p =>
                        p.status ===
                        'On Hold'
                ).length,

            completed:
                projects.filter(
                    p =>
                        p.status ===
                        'Completed'
                ).length,

            cancelled:
                projects.filter(
                    p =>
                        p.status ===
                        'Cancelled'
                ).length,
            totalBudget:
                projects.reduce(
                    (
                        sum,
                        project
                    ) =>
                        sum +
                        project.budget,
                    0
                ),

            archived:
                this.listArchived().length,

        };

    }

}

export const
    ProjectsRepositoryInstance =
        new ProjectsRepository();

