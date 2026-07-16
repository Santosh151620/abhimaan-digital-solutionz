import { NextResponse } from 'next/server';

import { AssetsServiceInstance } from '@/services/crm/AssetsService';

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(
    request: Request,
    { params }: RouteContext
) {

    try {

        const { id } = await params;

        const asset =
            AssetsServiceInstance.details(id);

        if (!asset) {

            return NextResponse.json(
                {
                    message: 'Asset not found.',
                },
                {
                    status: 404,
                }
            );

        }

        return NextResponse.json(
            asset,
            {
                status: 200,
            }
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to fetch asset.',
            },
            {
                status: 500,
            }
        );

    }

}

export async function PUT(
    request: Request,
    { params }: RouteContext
) {

    try {

        const { id } = await params;

        const body =
            await request.json();

        const asset =
            AssetsServiceInstance.update(
                id,
                body
            );

        if (!asset) {

            return NextResponse.json(
                {
                    message: 'Asset not found.',
                },
                {
                    status: 404,
                }
            );

        }

        return NextResponse.json(
            asset,
            {
                status: 200,
            }
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to update asset.',
            },
            {
                status: 500,
            }
        );

    }

}

export async function DELETE(
    request: Request,
    { params }: RouteContext
) {

    try {

        const { id } = await params;

        const deleted =
            AssetsServiceInstance.delete(id);

        if (!deleted) {

            return NextResponse.json(
                {
                    message: 'Asset not found.',
                },
                {
                    status: 404,
                }
            );

        }

        return NextResponse.json(
            {
                success: true,
            },
            {
                status: 200,
            }
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to delete asset.',
            },
            {
                status: 500,
            }
        );

    }

}