import {
    NextRequest,
    NextResponse,
} from 'next/server';

import {
    PaymentsServiceInstance,
} from '@/services/crm/PaymentsService';

interface RouteContext {

    params: Promise<{
        id: string;
    }>;

}

export async function GET(
    _request: NextRequest,
    context: RouteContext,
) {

    try {

        const {
            id,
        } = await context.params;

        const payment =
            await PaymentsServiceInstance.findById(
                id,
            );

        if (!payment) {

            return NextResponse.json(
                {
                    success: false,
                    message: 'Payment not found',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            {
                success: true,
                data: payment,
            },
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'PAYMENT_GET_ERROR',
            error,
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    'Unable to fetch payment',
            },
            {
                status: 500,
            },
        );

    }

}

export async function PUT(
    request: NextRequest,
    context: RouteContext,
) {

    try {

        const {
            id,
        } = await context.params;

        const body =
            await request.json();

        const payment =
            await PaymentsServiceInstance.update(
                id,
                body,
            );

        if (!payment) {

            return NextResponse.json(
                {
                    success: false,
                    message: 'Payment not found',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            {
                success: true,
                data: payment,
            },
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'PAYMENT_UPDATE_ERROR',
            error,
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    'Unable to update payment',
            },
            {
                status: 500,
            },
        );

    }

}

export async function DELETE(
    _request: NextRequest,
    context: RouteContext,
) {

    try {

        const {
            id,
        } = await context.params;

        const deleted =
            await PaymentsServiceInstance.delete(
                id,
            );

        if (!deleted) {

            return NextResponse.json(
                {
                    success: false,
                    message: 'Payment not found',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            {
                success: true,
                message:
                    'Payment archived successfully',
            },
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'PAYMENT_DELETE_ERROR',
            error,
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    'Unable to delete payment',
            },
            {
                status: 500,
            },
        );

    }

}