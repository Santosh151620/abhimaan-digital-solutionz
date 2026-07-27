import { NextResponse } from 'next/server';

import {
    NotificationsServiceInstance,
} from '@/services/crm/NotificationsService';

export async function GET() {

    const notifications =
        NotificationsServiceInstance.list();

    return NextResponse.json(
        notifications,
    );

}

export async function POST(
    request: Request,
) {

    const body =
        await request.json();

    const notification =
        NotificationsServiceInstance.create(
            body,
        );

    return NextResponse.json(

        notification,

        {
            status: 201,
        },

    );

}
