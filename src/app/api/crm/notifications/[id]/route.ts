import {
    NextResponse,
} from 'next/server';

import {
    createClient,
} from '@/lib/supabase/server';

import {
    createNotificationsService,
} from '@/services/crm/NotificationsService';


interface Context {

    params: Promise<{
        id: string;
    }>;

}



export async function GET(
    request: Request,
    context: Context,
) {

    const {
        id,
    } =
        await context.params;


    const supabase =
        await createClient();


    const service =
        createNotificationsService(
            supabase,
        );


    const notification =
        await service.details(
            id,
        );


    if (!notification) {

        return NextResponse.json(
            {
                error:
                    'Notification not found',
            },
            {
                status: 404,
            },
        );

    }


    return NextResponse.json(
        notification,
    );

}




export async function PUT(
    request: Request,
    context: Context,
) {

    const {
        id,
    } =
        await context.params;


    const body =
        await request.json();


    const supabase =
        await createClient();


    const service =
        createNotificationsService(
            supabase,
        );


    const notification =
        await service.update(
            id,
            body,
        );


    if (!notification) {

        return NextResponse.json(
            {
                error:
                    'Notification not found',
            },
            {
                status: 404,
            },
        );

    }


    return NextResponse.json(
        notification,
    );

}




export async function DELETE(
    request: Request,
    context: Context,
) {

    const {
        id,
    } =
        await context.params;


    const supabase =
        await createClient();


    const service =
        createNotificationsService(
            supabase,
        );


    const deleted =
        await service.delete(
            id,
        );


    if (!deleted) {

        return NextResponse.json(
            {
                error:
                    'Notification not found',
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

}