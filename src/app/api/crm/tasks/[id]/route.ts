import {
    NextRequest,
    NextResponse,
} from 'next/server';

import {
    TasksServiceInstance,
} from '@/services/crm/TasksService';

import type {
    TaskStatus,
} from '@/types/crm/Tasks';



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


        const task =
            TasksServiceInstance.details(
                id
            );


        if (!task) {

            return NextResponse.json(
                {
                    error:
                        'Task not found',
                },
                {
                    status: 404,
                }
            );

        }


        return NextResponse.json(
            task
        );


    } catch {

        return NextResponse.json(
            {
                error:
                    'Failed to fetch task',
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


        const task =
            TasksServiceInstance.update(
                id,
                body
            );


        if (!task) {

            return NextResponse.json(
                {
                    error:
                        'Task not found',
                },
                {
                    status: 404,
                }
            );

        }


        return NextResponse.json(
            task
        );


    } catch {

        return NextResponse.json(
            {
                error:
                    'Failed to update task',
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
                status?: TaskStatus;
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


        const task =
            TasksServiceInstance.updateStatus(
                id,
                body.status
            );


        if (!task) {

            return NextResponse.json(
                {
                    error:
                        'Task not found',
                },
                {
                    status: 404,
                }
            );

        }


        return NextResponse.json(
            task
        );


    } catch {

        return NextResponse.json(
            {
                error:
                    'Failed to update task status',
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
            TasksServiceInstance.delete(
                id
            );


        if (!deleted) {

            return NextResponse.json(
                {
                    error:
                        'Task not found',
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
                    'Failed to delete task',
            },
            {
                status: 500,
            }
        );

    }

}