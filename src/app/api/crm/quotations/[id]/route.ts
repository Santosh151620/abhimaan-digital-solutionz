import {
    NextRequest,
    NextResponse,
} from 'next/server';

import {
    QuotationsServiceInstance,
} from '@/services/crm/QuotationsService';

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

        const quotation =
            await QuotationsServiceInstance.details(
                id,
            );

        if (!quotation) {

            return NextResponse.json(
                {
                    message:
                        'Quotation not found',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            quotation,
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'QUOTATION_GET_ERROR',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to load quotation',
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

        const quotation =
            await QuotationsServiceInstance.update(
                id,
                body,
            );

        if (!quotation) {

            return NextResponse.json(
                {
                    message:
                        'Quotation not found',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            quotation,
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'QUOTATION_UPDATE_ERROR',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to update quotation',
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

        await QuotationsServiceInstance.delete(
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
            'QUOTATION_DELETE_ERROR',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to delete quotation',
            },
            {
                status: 500,
            },
        );

    }

}