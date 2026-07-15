import { NextRequest, NextResponse } from 'next/server';

import { QuotationsServiceInstance } from '@/services/crm/QuotationsService';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: NextRequest,
    { params }: Props
) {

    const { id } = await params;

    const quotation =
        QuotationsServiceInstance.details(id);

    if (!quotation) {

        return NextResponse.json(
            {
                message: 'Quotation not found',
            },
            {
                status: 404,
            }
        );

    }

    return NextResponse.json(
        quotation
    );

}

export async function PUT(
    request: NextRequest,
    { params }: Props
) {

    const { id } = await params;

    const body = await request.json();

    const quotation =
        QuotationsServiceInstance.update(
            id,
            body
        );

    if (!quotation) {

        return NextResponse.json(
            {
                message: 'Quotation not found',
            },
            {
                status: 404,
            }
        );

    }

    return NextResponse.json(
        quotation
    );

}

export async function DELETE(
    request: NextRequest,
    { params }: Props
) {

    const { id } = await params;

    const deleted =
        QuotationsServiceInstance.delete(id);

    if (!deleted) {

        return NextResponse.json(
            {
                message: 'Quotation not found',
            },
            {
                status: 404,
            }
        );

    }

    return NextResponse.json({
        success: true,
    });

}