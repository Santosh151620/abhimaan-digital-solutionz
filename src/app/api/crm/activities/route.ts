import {
    NextRequest,
    NextResponse,
} from 'next/server';

import {
    ActivityServiceInstance,
} from '@/services/crm/ActivityService';


export async function GET() {

    try {

        const activities =
            await ActivityServiceInstance.list();


        return NextResponse.json(
            activities,
        );


    } catch {

        return NextResponse.json(

            {
                error:
                    'Failed to fetch activities',
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


        const activity =
            await ActivityServiceInstance.create(
                body,
            );


        return NextResponse.json(

            activity,

            {
                status: 201,
            },

        );


    } catch {

        return NextResponse.json(

            {
                error:
                    'Failed to create activity',
            },

            {
                status: 500,
            },

        );

    }

}
