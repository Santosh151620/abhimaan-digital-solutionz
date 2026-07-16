import { NextResponse } from 'next/server';

import {
    ContractsServiceInstance,
} from '@/services/crm/ContractsService';

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: Request,
    { params }: RouteContext
) {

    const { id } =
        await params;

    const contract =
        ContractsServiceInstance.details(id);

    if (!contract) {

        return NextResponse.json(
            {
                message:
                    'Contract not found',
            },
            {
                status: 404,
            }
        );

    }

    return NextResponse.json(
        contract
    );

}

export async function PUT(
    request: Request,
    { params }: RouteContext
) {

    const { id } =
        await params;

    const body =
        await request.json();

    const updated =
        ContractsServiceInstance.update(
            id,
            body
        );

    if (!updated) {

        return NextResponse.json(
            {
                message:
                    'Contract not found',
            },
            {
                status: 404,
            }
        );

    }

    return NextResponse.json(
        updated
    );

}

export async function DELETE(
    request: Request,
    { params }: RouteContext
) {

    const { id } =
        await params;

    const deleted =
        ContractsServiceInstance.delete(
            id
        );

    if (!deleted) {

        return NextResponse.json(
            {
                message:
                    'Contract not found',
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