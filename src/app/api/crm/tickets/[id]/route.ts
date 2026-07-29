import {
    NextRequest,
    NextResponse,
} from 'next/server';

import {
    TicketsServiceInstance,
} from '@/services/crm/TicketsService';

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

        const ticket =
            await TicketsServiceInstance.details(
                id,
            );

        if (!ticket) {

            return NextResponse.json(
                {
                    message:
                        'Ticket not found',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            ticket,
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'TICKET_GET_ERROR',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to load ticket',
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

        const ticket =
            await TicketsServiceInstance.update(
                id,
                body,
            );

        if (!ticket) {

            return NextResponse.json(
                {
                    message:
                        'Ticket not found',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            ticket,
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'TICKET_UPDATE_ERROR',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to update ticket',
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

        const deleted =
            await TicketsServiceInstance.delete(
                id,
            );

        if (!deleted) {

            return NextResponse.json(
                {
                    message:
                        'Ticket not found',
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
            'TICKET_DELETE_ERROR',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to delete ticket',
            },
            {
                status: 500,
            },
        );

    }

}