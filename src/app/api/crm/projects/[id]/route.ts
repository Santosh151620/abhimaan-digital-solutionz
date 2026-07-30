import {
    NextRequest,
    NextResponse,
} from 'next/server';

import {
    ProjectsServiceInstance,
} from '@/services/crm/ProjectsService';

import type {
    ProjectStatus,
} from '@/types/crm/Projects';

interface RouteContext {

    params: Promise<{
        id: string;
    }>;

}

export async function GET(
    _request: NextRequest,
    { params }: RouteContext,
) {

    try {

        const {
            id,
        } = await params;

        const project =
            await ProjectsServiceInstance.details(
                id,
            );

        if (!project) {

            return NextResponse.json(
                {
                    error:
                        'Project not found',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            project,
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'PROJECT_GET_ERROR',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to fetch project',
            },
            {
                status: 500,
            },
        );

    }

}

export async function PUT(
    request: NextRequest,
    { params }: RouteContext,
) {

    try {

        const {
            id,
        } = await params;

        const body =
            await request.json();

        const project =
            await ProjectsServiceInstance.update(
                id,
                body,
            );

        if (!project) {

            return NextResponse.json(
                {
                    error:
                        'Project not found',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            project,
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'PROJECT_UPDATE_ERROR',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to update project',
            },
            {
                status: 500,
            },
        );

    }

}

export async function PATCH(
    request: NextRequest,
    { params }: RouteContext,
) {

    try {

        const {
            id,
        } = await params;

        const body: {
            status?: ProjectStatus;
        } = await request.json();

        if (!body.status) {

            return NextResponse.json(
                {
                    error:
                        'Status is required',
                },
                {
                    status: 400,
                },
            );

        }

        const project =
            await ProjectsServiceInstance.updateStatus(
                id,
                body.status,
            );

        if (!project) {

            return NextResponse.json(
                {
                    error:
                        'Project not found',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            project,
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'PROJECT_STATUS_UPDATE_ERROR',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to update project status',
            },
            {
                status: 500,
            },
        );

    }

}

export async function DELETE(
    _request: NextRequest,
    { params }: RouteContext,
) {

    try {

        const {
            id,
        } = await params;

        await ProjectsServiceInstance.delete(id);
        return NextResponse.json(
            {
                success: true,
            },
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'PROJECT_DELETE_ERROR',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to delete project',
            },
            {
                status: 500,
            },
        );

    }

}