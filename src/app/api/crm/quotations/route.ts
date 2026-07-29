import {
    NextRequest,
    NextResponse,
} from 'next/server';

import {
    QuotationsServiceInstance,
} from '@/services/crm/QuotationsService';

export async function GET() {

    try {

        const quotations =
            await QuotationsServiceInstance.list();

        return NextResponse.json(
            quotations,
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'QUOTATIONS_GET_ERROR',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to load quotations',
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

        const quotation =
            await QuotationsServiceInstance.create(
                body,
            );

        return NextResponse.json(
            quotation,
            {
                status: 201,
            },
        );

    } catch (error) {

        console.error(
            'QUOTATIONS_POST_ERROR',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to create quotation',
            },
            {
                status: 500,
            },
        );

    }

}