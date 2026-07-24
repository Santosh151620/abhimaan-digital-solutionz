import {
    NextRequest,
    NextResponse,
} from 'next/server';

import {
    QuotationsServiceInstance,
} from '@/services/crm/QuotationsService';

export async function GET() {

    const quotations =
        await QuotationsServiceInstance.list();

    return NextResponse.json(
        quotations,
    );

}

export async function POST(
    request: NextRequest,
) {

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

}
