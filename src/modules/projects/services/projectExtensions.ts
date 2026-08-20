import type {
    Project,
    ProjectStatus,
} from "@/modules/projects/types/project";


export interface EnrichedProject
    extends Project {

    normalizedStatus:
        ProjectStatus;

    isActive:
        boolean;

    isCompleted:
        boolean;

    isDelayed:
        boolean;

    durationDays:
        number;

    progress:
        number;
}


export function normalizeProjectStatus(
    status: ProjectStatus | string,
): ProjectStatus {

    switch (
        status
            ?.trim()
            .toLowerCase()
    ) {

        case "active":
        case "in_progress":
            return "Active";

        case "planning":
            return "Planning";

        case "on_hold":
        case "hold":
            return "On Hold";

        case "completed":
            return "Completed";

        case "cancelled":
        case "canceled":
            return "Cancelled";

        default:
            return "Planning";
    }
}


export function calculateProjectDuration(
    start?: string | null,
    end?: string | null,
): number {

    if (!start || !end) {
        return 0;
    }


    const startTime =
        new Date(start).getTime();


    const endTime =
        new Date(end).getTime();


    if (
        !Number.isFinite(startTime) ||
        !Number.isFinite(endTime)
    ) {
        return 0;
    }


    if (endTime <= startTime) {
        return 0;
    }


    return Math.ceil(
        (
            endTime -
            startTime
        ) /
        (
            1000 *
            60 *
            60 *
            24
        ),
    );
}


export function calculateProgressFromDates(
    start?: string | null,
    end?: string | null,
): number {

    if (!start || !end) {
        return 0;
    }


    const startTime =
        new Date(start).getTime();


    const endTime =
        new Date(end).getTime();


    if (
        !Number.isFinite(startTime) ||
        !Number.isFinite(endTime) ||
        endTime <= startTime
    ) {
        return 0;
    }


    const now =
        Date.now();


    if (
        now <= startTime
    ) {
        return 0;
    }


    if (
        now >= endTime
    ) {
        return 100;
    }


    return Math.round(
        (
            (
                now -
                startTime
            ) /
            (
                endTime -
                startTime
            )
        ) *
        100,
    );
}


export function enrichProject(
    project: Project,
): EnrichedProject {

    const normalizedStatus =
        normalizeProjectStatus(
            project.status,
        );


    const isActive =
        normalizedStatus ===
        "Active";


    const isCompleted =
        normalizedStatus ===
        "Completed";


    const isDelayed =
        Boolean(
            project.endDate &&
            new Date(
                project.endDate,
            ).getTime() <
                Date.now() &&
            !isCompleted,
        );


    const durationDays =
        calculateProjectDuration(
            project.startDate,
            project.endDate,
        );


    const progress =
        isCompleted
            ? 100
            : calculateProgressFromDates(
                project.startDate,
                project.endDate,
            );


    return {

        ...project,

        normalizedStatus,

        isActive,

        isCompleted,

        isDelayed,

        durationDays,

        progress,

    };
}


export function getProjectHealthScore(
    project: Project,
): {
    score: number;
    label:
        | "GOOD"
        | "AT_RISK"
        | "CRITICAL";
} {

    let score = 100;


    const enriched =
        enrichProject(project);


    if (
        enriched.isDelayed
    ) {
        score -= 40;
    }


    if (
        enriched.normalizedStatus ===
        "On Hold"
    ) {
        score -= 20;
    }


    if (
        !project.startDate ||
        !project.endDate
    ) {
        score -= 15;
    }


    if (
        enriched.isCompleted
    ) {
        score = 100;
    }


    score =
        Math.max(
            0,
            Math.min(
                100,
                score,
            ),
        );


    let label:
        | "GOOD"
        | "AT_RISK"
        | "CRITICAL" =
        "GOOD";


    if (score < 40) {
        label = "CRITICAL";
    } else if (score < 70) {
        label = "AT_RISK";
    }


    return {
        score,
        label,
    };
}


export function groupProjectsByCompany(
    projects: Project[],
): Record<string, Project[]> {

    return projects.reduce(
        (
            grouped,
            project,
        ) => {

            const key =
                project.companyId ??
                "unassigned";


            if (
                !grouped[key]
            ) {
                grouped[key] = [];
            }


            grouped[key].push(
                project,
            );


            return grouped;

        },
        {} as Record<
            string,
            Project[]
        >,
    );
}


/**
 * Backward-compatible alias for existing
 * consumers that still use the old helper name.
 */
export function groupProjectsByClient(
    projects: Project[],
): Record<string, Project[]> {

    return groupProjectsByCompany(
        projects,
    );
}


export function calculateProjectKPIs(
    projects: Project[],
) {

    const total =
        projects.length;


    const active =
        projects.filter(
            project =>
                normalizeProjectStatus(
                    project.status,
                ) === "Active",
        ).length;


    const completed =
        projects.filter(
            project =>
                normalizeProjectStatus(
                    project.status,
                ) === "Completed",
        ).length;


    const delayed =
        projects.filter(
            project =>
                enrichProject(
                    project,
                ).isDelayed,
        ).length;


    const totalDuration =
        projects.reduce(
            (
                sum,
                project,
            ) =>
                sum +
                calculateProjectDuration(
                    project.startDate,
                    project.endDate,
                ),
            0,
        );


    const totalBudget =
        projects.reduce(
            (
                sum,
                project,
            ) =>
                sum +
                Number(
                    project.budget ?? 0,
                ),
            0,
        );


    return {

        total,

        active,

        completed,

        delayed,

        totalBudget,

        avgDuration:
            total === 0
                ? 0
                : Math.round(
                    totalDuration /
                    total,
                ),

        completionRate:
            total === 0
                ? 0
                : Math.round(
                    (
                        completed /
                        total
                    ) *
                    100,
                ),

    };
}