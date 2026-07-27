import { NextResponse } from 'next/server';

import {
    OpportunitiesServiceInstance,
} from '@/services/crm/OpportunitiesService';

interface RouteContext {

    params: Promise<{
        id: string;
    }>;

}

export async function GET(
    _request: Request,
    { params }: RouteContext,
) {

    try {

        const { id } =
            await params;

        const opportunity =
            await OpportunitiesServiceInstance.details(
                id,
            );

        if (!opportunity) {

            return NextResponse.json(

                {
                    error: 'Opportunity not found',
                },

                {
                    status: 404,
                },

            );

        }

        return NextResponse.json(
            opportunity,
        );

    } catch {

        return NextResponse.json(

            {
                error: 'Failed to load opportunity',
            },

            {
                status: 500,
            },

        );

    }

}

export async function PATCH(
    request: Request,
    { params }: RouteContext,
) {

    try {

        const { id } =
            await params;

        const body =
            await request.json();

        const opportunity =
            await OpportunitiesServiceInstance.update(
                id,
                body,
            );

        return NextResponse.json(
            opportunity,
        );

    } catch {

        return NextResponse.json(

            {
                error: 'Failed to update opportunity',
            },

            {
                status: 500,
            },

        );

    }

}

export async function DELETE(
    _request: Request,
    { params }: RouteContext,
) {

    try {

        const { id } =
            await params;

        await OpportunitiesServiceInstance.delete(
            id,
        );

        return NextResponse.json({

            success: true,

        });

    } catch {

        return NextResponse.json(

            {
                error: 'Failed to delete opportunity',
            },

            {
                status: 500,
            },

        );

    }

}