import {
    NextRequest,
    NextResponse,
} from 'next/server';

import {
    OpportunitiesServiceInstance,
} from '@/services/crm/OpportunitiesService';

import type {
    OpportunitySearchFilters,
    OpportunityStage,
    OpportunityStatus,
} from '@/types/crm/Opportunities';


export async function GET(
    request: NextRequest,
) {

    try {

        const searchParams =
            request.nextUrl.searchParams;


        const status =
            searchParams.get('status');


        const stage =
            searchParams.get('stage');


        const companyId =
            searchParams.get('companyId');


        const search =
            searchParams.get('search');


        const filters: OpportunitySearchFilters = {

            status:
                status
                    ? status as OpportunityStatus
                    : undefined,

            stage:
                stage
                    ? stage as OpportunityStage
                    : undefined,

            companyId:
                companyId
                ??
                undefined,

            search:
                search
                ??
                undefined,

        };


        const hasFilters =
            Object.values(filters)
                .some(
                    value =>
                        value !== undefined &&
                        value !== '',
                );


        const opportunities =
            hasFilters
                ? await OpportunitiesServiceInstance.search(
                    filters,
                )
                : await OpportunitiesServiceInstance.list();


        return NextResponse.json(
            {
                success: true,
                data: opportunities,
            },
            {
                status: 200,
            },
        );

    } catch (error) {

        console.error(
            'OPPORTUNITIES_LIST_ERROR',
            error,
        );


        return NextResponse.json(
            {
                success: false,
                error: 'Failed to load opportunities',
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


        if (
            !body ||
            typeof body !== 'object' ||
            Array.isArray(body)
        ) {

            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid request body',
                },
                {
                    status: 400,
                },
            );

        }


        if (
            typeof body.name !== 'string' &&
            typeof body.title !== 'string'
        ) {

            return NextResponse.json(
                {
                    success: false,
                    error: 'Opportunity name is required',
                },
                {
                    status: 400,
                },
            );

        }


        const opportunity =
            await OpportunitiesServiceInstance.create(
                body,
            );


        return NextResponse.json(
            {
                success: true,
                data: opportunity,
            },
            {
                status: 201,
            },
        );

    } catch (error) {

        console.error(
            'OPPORTUNITY_CREATE_ERROR',
            error,
        );


        const message =
            error instanceof Error
                ? error.message
                : 'Failed to create opportunity';


        return NextResponse.json(
            {
                success: false,
                error: message,
            },
            {
                status: 400,
            },
        );

    }

}