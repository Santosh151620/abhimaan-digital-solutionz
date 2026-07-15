import { NextRequest, NextResponse } from 'next/server';

import { QuotationsServiceInstance } from '@/services/crm/QuotationsService';

export async function GET() {

    return NextResponse.json(
        QuotationsServiceInstance.list()
    );

}

export async function POST(
    request: NextRequest
) {

    const body = await request.json();

    const quotation =
        QuotationsServiceInstance.create(body);

    return NextResponse.json(
        quotation,
        {
            status: 201,
        }
    );

}




