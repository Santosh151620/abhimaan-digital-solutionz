import { NextResponse } from 'next/server';

import { AssetsServiceInstance } from '@/services/crm/AssetsService';

export async function GET() {

    try {

        const assets =
            AssetsServiceInstance.list();

        return NextResponse.json(
            assets,
            {
                status: 200,
            }
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to fetch assets.',
            },
            {
                status: 500,
            }
        );

    }

}

export async function POST(
    request: Request
) {

    try {

        const body =
            await request.json();

        const asset =
            AssetsServiceInstance.create(
                body
            );

        return NextResponse.json(
            asset,
            {
                status: 201,
            }
        );

    } catch {

        return NextResponse.json(
            {
                message:
                    'Failed to create asset.',
            },
            {
                status: 500,
            }
        );

    }

}