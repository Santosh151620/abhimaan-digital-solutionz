import {
    NextRequest,
    NextResponse,
} from 'next/server';

import {
    ActivityServiceInstance,
} from '@/services/crm/ActivityService';

import type {
    ActivityStatus,
} from '@/types/crm/Activities';


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


        const activity =
            ActivityServiceInstance.details(
                id
            );


        if (!activity) {

            return NextResponse.json(
                {
                    error:
                        'Activity not found',
                },
                {
                    status: 404,
                }
            );

        }


        return NextResponse.json(
            activity
        );


    } catch {

        return NextResponse.json(
            {
                error:
                    'Failed to fetch activity',
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


        const activity =
            ActivityServiceInstance.update(
                id,
                body
            );


        if (!activity) {

            return NextResponse.json(
                {
                    error:
                        'Activity not found',
                },
                {
                    status: 404,
                }
            );

        }


        return NextResponse.json(
            activity
        );


    } catch {

        return NextResponse.json(
            {
                error:
                    'Failed to update activity',
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
                status?: ActivityStatus;
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


        const activity =
            ActivityServiceInstance.updateStatus(
                id,
                body.status
            );


        if (!activity) {

            return NextResponse.json(
                {
                    error:
                        'Activity not found',
                },
                {
                    status: 404,
                }
            );

        }


        return NextResponse.json(
            activity
        );


    } catch {

        return NextResponse.json(
            {
                error:
                    'Failed to update activity status',
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
            ActivityServiceInstance.delete(
                id
            );


        if (!deleted) {

            return NextResponse.json(
                {
                    error:
                        'Activity not found',
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
                    'Failed to delete activity',
            },
            {
                status: 500,
            }
        );

    }

}
