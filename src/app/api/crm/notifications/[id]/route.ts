import { NextResponse } from 'next/server';

import {
    NotificationsServiceInstance,
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

    const notification =
        NotificationsServiceInstance.details(
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

    const notification =
        NotificationsServiceInstance.update(

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

    const deleted =
        NotificationsServiceInstance.delete(
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

    return NextResponse.json({

        success: true,

    });

}