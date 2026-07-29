import {
    NextResponse,
} from 'next/server';

import {
    createClient,
} from '@/lib/supabase/server';

import {
    createNotificationsRepository,
} from '@/repositories/crm/NotificationsRepository';

import type {
    NotificationSearchFilters,
} from '@/types/crm/Notifications';



export async function GET(
    request: Request,
) {

    const supabase =
        await createClient();

    const repository =
        createNotificationsRepository(
            supabase,
        );

    const {
        searchParams,
    } =
        new URL(
            request.url,
        );

    const filters: NotificationSearchFilters = {

        status:
            searchParams.get(
                'status',
            ) as NotificationSearchFilters['status'] ?? undefined,

        type:
            searchParams.get(
                'type',
            ) as NotificationSearchFilters['type'] ?? undefined,

        priority:
            searchParams.get(
                'priority',
            ) as NotificationSearchFilters['priority'] ?? undefined,

        entityType:
            searchParams.get(
                'entityType',
            ) ?? undefined,

        entityId:
            searchParams.get(
                'entityId',
            ) ?? undefined,

        ownerId:
            searchParams.get(
                'ownerId',
            ) ?? undefined,

        userId:
            searchParams.get(
                'userId',
            ) ?? undefined,

        search:
            searchParams.get(
                'search',
            ) ?? undefined,

    };

    const hasFilters =

        Object.values(
            filters,
        ).some(
            value =>
                value !== undefined,
        );

    const notifications =
        hasFilters

            ? await repository.search(
                filters,
            )

            : await repository.list();

    return NextResponse.json(
        notifications,
    );

}



export async function POST(
    request: Request,
) {

    const supabase =
        await createClient();

    const repository =
        createNotificationsRepository(
            supabase,
        );

    const body =
        await request.json();

    const notification =
        await repository.create(
            body,
        );

    return NextResponse.json(

        notification,

        {
            status: 201,
        },

    );

}
