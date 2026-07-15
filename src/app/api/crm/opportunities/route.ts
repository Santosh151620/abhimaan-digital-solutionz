import { NextResponse } from 'next/server';
import { OpportunitiesServiceInstance } from '@/services/crm/OpportunitiesService';

export async function GET() {

    try {

        return NextResponse.json(
            await OpportunitiesServiceInstance.list()
        );

    } catch {

        return NextResponse.json(
            {
                error: 'Failed to load opportunities',
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

        const body = await request.json();

        return NextResponse.json(
            await OpportunitiesServiceInstance.create(body),
            {
                status: 201,
            }
        );

    } catch {

        return NextResponse.json(
            {
                error: 'Failed to create opportunity',
            },
            {
                status: 500,
            }
        );

    }

}




