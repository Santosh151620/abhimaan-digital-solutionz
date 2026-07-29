import {
    NextRequest,
    NextResponse,
} from 'next/server';

import {
    TicketsServiceInstance,
} from '@/services/crm/TicketsService';

export async function GET() {

    try {

        const tickets =
            await TicketsServiceInstance.list();

        return NextResponse.json(
            tickets,
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'TICKETS_GET_ERROR',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to load tickets',
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

        const ticket =
            await TicketsServiceInstance.create(
                body,
            );

        return NextResponse.json(
            ticket,
            {
                status: 201,
            },
        );

    } catch (error) {

        console.error(
            'TICKETS_POST_ERROR',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to create ticket',
            },
            {
                status: 500,
            },
        );

    }

}