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
    { params }: RouteContext,
) {

    try {

        const { id } =
            await params;

        const contract =
            await ContractsServiceInstance.details(
                id,
            );

        if (!contract) {

            return NextResponse.json(
                {
                    error:
                        'Contract not found',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            {
                data: contract,
            },
        );

    } catch (error) {

        console.error(
            'Contracts GET by ID error:',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to load contract',
            },
            {
                status: 500,
            },
        );

    }

}

export async function PUT(
    request: Request,
    { params }: RouteContext,
) {

    try {

        const { id } =
            await params;

        const body =
            await request.json();

        const updated =
            await ContractsServiceInstance.update(
                id,
                body,
            );

        if (!updated) {

            return NextResponse.json(
                {
                    error:
                        'Contract not found',
                },
                {
                    status: 404,
                },
            );

        }

        return NextResponse.json(
            {
                data: updated,
            },
        );

    } catch (error) {

        console.error(
            'Contracts PUT error:',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to update contract',
            },
            {
                status: 500,
            },
        );

    }

}

export async function DELETE(
    request: Request,
    { params }: RouteContext,
) {

    try {

        const { id } =
            await params;

        const deleted =
            await ContractsServiceInstance.delete(
                id,
            );

        if (!deleted) {

            return NextResponse.json(
                {
                    error:
                        'Contract not found',
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
        );

    } catch (error) {

        console.error(
            'Contracts DELETE error:',
            error,
        );

        return NextResponse.json(
            {
                error:
                    'Failed to delete contract',
            },
            {
                status: 500,
            },
        );

    }

}