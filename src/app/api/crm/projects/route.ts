import {
    NextRequest,
    NextResponse,
} from "next/server";

import {
    ProjectsServiceInstance,
} from "@/services/crm/ProjectsService";

import type {
    ProjectListQuery,
} from "@/repositories/crm/ProjectsRepository";

export async function GET(
    request: NextRequest,
) {

    try {

        const search =
            request.nextUrl.searchParams.get("search")?.trim() || undefined;
        const rawStatus =
            request.nextUrl.searchParams.get("status") ??
            undefined;

        const status: ProjectListQuery["status"] =
            rawStatus === "All" ||
            rawStatus === "Planning" ||
            rawStatus === "Active" ||
            rawStatus === "On Hold" ||
            rawStatus === "Completed" ||
            rawStatus === "Cancelled"
                ? rawStatus
                : undefined;

        const page =
            Math.max(
                1,
                Number(
                    request.nextUrl.searchParams.get("page") ??
                    1,
                ),
            );

        const pageSize =
            Math.min(
                100,
                Math.max(
                    1,
                    Number(
                        request.nextUrl.searchParams.get("pageSize") ??
                        20,
                    ),
                ),
            );

        const filters: ProjectListQuery = {
            search,
            status,
            page,
            pageSize,
        };

        const projects =
            await ProjectsServiceInstance.listPaginated(
                filters,
            );

        return NextResponse.json(
            {
                success: true,
                data: projects.projects,
                total: projects.total,
                page: projects.page,
                pageSize: projects.pageSize,
                totalPages: projects.totalPages,
            },
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            "PROJECTS_LIST_API_ERROR",
            error,
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to load projects",
            },
            {
                status: 500,
            },
        );

    }

}

export async function POST(
    request: NextRequest,
) {

    try {

        const body =
            await request.json();

        if (
            !body.name ||
            typeof body.name !== "string"
        ) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Project name is required",
                },
                {
                    status: 400,
                },
            );

        }

        const project =
            await ProjectsServiceInstance.create(
                body,
            );

        return NextResponse.json(
            {
                success: true,
                data: project,
            },
            {
                status: 201,
            },
        );

    } catch (error) {

        console.error(
            "PROJECT_CREATE_API_ERROR",
            error,
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to create project",
            },
            {
                status: 500,
            },
        );

    }

}
