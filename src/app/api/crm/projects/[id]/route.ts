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


interface Props {

    params: Promise<{
        id: string;
    }>;

}




export async function GET(
    request: NextRequest,
    { params }: Props
) {

    try {

        const {
            id,
        } = await params;


        const project =
            ProjectsServiceInstance.details(
                id
            );


        if (!project) {

            return NextResponse.json(
                {
                    error:
                        'Project not found',
                },
                {
                    status: 404,
                }
            );

        }


        return NextResponse.json(
            project
        );


    } catch {

        return NextResponse.json(
            {
                error:
                    'Failed to fetch project',
            },
            {
                status: 500,
            }
        );

    }

}




export async function PUT(
    request: NextRequest,
    { params }: Props
) {

    try {

        const {
            id,
        } = await params;


        const body =
            await request.json();


        const project =
            ProjectsServiceInstance.update(
                id,
                body
            );


        if (!project) {

            return NextResponse.json(
                {
                    error:
                        'Project not found',
                },
                {
                    status: 404,
                }
            );

        }


        return NextResponse.json(
            project
        );


    } catch {

        return NextResponse.json(
            {
                error:
                    'Failed to update project',
            },
            {
                status: 500,
            }
        );

    }

}




export async function PATCH(
    request: NextRequest,
    { params }: Props
) {

    try {

        const {
            id,
        } = await params;


        const body:
            {
                status?: ProjectStatus;
            } =
            await request.json();


        if (!body.status) {

            return NextResponse.json(
                {
                    error:
                        'Status is required',
                },
                {
                    status: 400,
                }
            );

        }


        const project =
            ProjectsServiceInstance.updateStatus(
                id,
                body.status
            );


        if (!project) {

            return NextResponse.json(
                {
                    error:
                        'Project not found',
                },
                {
                    status: 404,
                }
            );

        }


        return NextResponse.json(
            project
        );


    } catch {

        return NextResponse.json(
            {
                error:
                    'Failed to update project status',
            },
            {
                status: 500,
            }
        );

    }

}




export async function DELETE(
    request: NextRequest,
    { params }: Props
) {

    try {

        const {
            id,
        } = await params;


        const deleted =
            ProjectsServiceInstance.delete(
                id
            );


        if (!deleted) {

            return NextResponse.json(
                {
                    error:
                        'Project not found',
                },
                {
                    status: 404,
                }
            );

        }


        return NextResponse.json(
            {
                success: true,
            }
        );


    } catch {

        return NextResponse.json(
            {
                error:
                    'Failed to delete project',
            },
            {
                status: 500,
            }
        );

    }

}