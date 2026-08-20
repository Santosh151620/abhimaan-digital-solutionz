import type {
    Project,
} from "@/modules/projects/types/project";


const DEFAULT_PROJECT_NAME =
    "Untitled Project";


const DEFAULT_PROJECT_PRIORITY =
    "MEDIUM";


export function normalizeProjects(
    projects: Project[],
): Project[] {

    return projects.map(
        project => ({

            ...project,

            id:
                project.id,

            projectNumber:
                project.projectNumber,

            name:
                project.name?.trim() ||
                DEFAULT_PROJECT_NAME,

            description:
                project.description ??
                undefined,

            status:
                project.status,

            projectType:
                project.projectType ??
                undefined,

            priority:
                project.priority ||
                DEFAULT_PROJECT_PRIORITY,

            ownerUserId:
                project.ownerUserId ??
                undefined,

            manager:
                project.manager ??
                undefined,

            companyId:
                project.companyId ??
                undefined,

            contactId:
                project.contactId ??
                undefined,

            opportunityId:
                project.opportunityId ??
                undefined,

            contractId:
                project.contractId ??
                undefined,

            customerName:
                project.customerName ??
                undefined,

            startDate:
                project.startDate ??
                undefined,

            endDate:
                project.endDate ??
                undefined,

            actualEndDate:
                project.actualEndDate ??
                undefined,

            budget:
                Number(
                    project.budget ?? 0,
                ),

            actualCost:
                project.actualCost !==
                undefined
                    ? Number(
                        project.actualCost,
                    )
                    : undefined,

            currency:
                project.currency ??
                undefined,

            metadata:
                project.metadata ??
                undefined,

            archived:
                project.archived ??
                false,

            createdAt:
                project.createdAt,

            updatedAt:
                project.updatedAt,

        }),
    );
}