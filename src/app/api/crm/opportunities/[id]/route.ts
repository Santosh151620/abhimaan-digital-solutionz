import {
    NextRequest,
    NextResponse,
} from 'next/server';

import {
    OpportunitiesServiceInstance,
} from '@/services/crm/OpportunitiesService';


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


        if (!id?.trim()) {

            return NextResponse.json(
                {
                    success: false,
                    error: 'Opportunity id is required',
                },
                {
                    status: 400,
                },
            );

        }


        const opportunity =
            await OpportunitiesServiceInstance.details(
                id,
            );


        if (!opportunity) {

            return NextResponse.json(
                {
                    success: false,
                    error: 'Opportunity not found',
                },
                {
                    status: 404,
                },
            );

        }


        return NextResponse.json(
            {
                success: true,
                data: opportunity,
            },
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'OPPORTUNITY_GET_ERROR',
            error,
        );


        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch opportunity',
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


        if (!id?.trim()) {

            return NextResponse.json(
                {
                    success: false,
                    error: 'Opportunity id is required',
                },
                {
                    status: 400,
                },
            );

        }


        const body =
            await request.json();


        if (
            !body ||
            typeof body !== 'object' ||
            Array.isArray(body)
        ) {

            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid request body',
                },
                {
                    status: 400,
                },
            );

        }


        const opportunity =
            await OpportunitiesServiceInstance.update(
                id,
                body,
            );


        if (!opportunity) {

            return NextResponse.json(
                {
                    success: false,
                    error: 'Opportunity not found',
                },
                {
                    status: 404,
                },
            );

        }


        return NextResponse.json(
            {
                success: true,
                data: opportunity,
            },
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'OPPORTUNITY_UPDATE_ERROR',
            error,
        );


        const message =
            error instanceof Error
                ? error.message
                : 'Failed to update opportunity';


        return NextResponse.json(
            {
                success: false,
                error: message,
            },
            {
                status: 400,
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


        if (!id?.trim()) {

            return NextResponse.json(
                {
                    success: false,
                    error: 'Opportunity id is required',
                },
                {
                    status: 400,
                },
            );

        }


        const existing =
            await OpportunitiesServiceInstance.details(
                id,
            );


        if (!existing) {

            return NextResponse.json(
                {
                    success: false,
                    error: 'Opportunity not found',
                },
                {
                    status: 404,
                },
            );

        }


        await OpportunitiesServiceInstance.delete(
            id,
        );


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
            'OPPORTUNITY_DELETE_ERROR',
            error,
        );


        return NextResponse.json(
            {
                success: false,
                error: 'Failed to delete opportunity',
            },
            {
                status: 500,
            },
        );

    }

}