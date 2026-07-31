import {
    NextRequest,
    NextResponse,
} from "next/server";

import {
    ProjectsServiceInstance,
} from "@/services/crm/ProjectsService";

export async function GET(
    request: NextRequest,
) {

    try {

        const search =
            request.nextUrl.searchParams.get("search") ?? undefined;

        const status =
            request.nextUrl.searchParams.get("status") ?? undefined;

        const projects =
            await ProjectsServiceInstance.list();

        const filtered =
            projects.filter(project => {

                if (
                    search &&
                    !project.name
                        .toLowerCase()
                        .includes(search.toLowerCase())
                ) {

                    return false;

                }

                if (
                    status &&
                    project.status !== status
                ) {

                    return false;

                }

                return true;

            });

        return NextResponse.json(
            {
                success: true,
                data: filtered,
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