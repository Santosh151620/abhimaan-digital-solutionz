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

        const { id } =
            await params;

        const activity =
            await ActivityServiceInstance.details(
                id,
            );

        if (!activity) {

            return NextResponse.json(
                {
                    error:
                        'Activity not found',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            activity,
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'ACTIVITY_GET_ERROR',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to fetch activity',
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

        const { id } =
            await params;

        const body =
            await request.json();

        const activity =
            await ActivityServiceInstance.update(
                id,
                body,
            );

        if (!activity) {

            return NextResponse.json(
                {
                    error:
                        'Activity not found',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            activity,
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'ACTIVITY_UPDATE_ERROR',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to update activity',
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

        const { id } =
            await params;

        const body: {
            status?: ActivityStatus;
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

        const activity =
            await ActivityServiceInstance.updateStatus(
                id,
                body.status,
            );

        if (!activity) {

            return NextResponse.json(
                {
                    error:
                        'Activity not found',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            activity,
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'ACTIVITY_STATUS_UPDATE_ERROR',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to update activity status',
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

        const { id } =
            await params;

        const deleted =
            await ActivityServiceInstance.delete(
                id,
            );

        if (!deleted) {

            return NextResponse.json(
                {
                    error:
                        'Activity not found',
                },
                {
                    status: 404,
                },
            );

        }

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
            'ACTIVITY_DELETE_ERROR',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to delete activity',
            },
            {
                status: 500,
            },
        );

    }

}