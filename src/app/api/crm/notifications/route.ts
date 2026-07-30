import { createNotificationsService } from "@/services/crm/NotificationsService";
import { withTenantGuard } from "@/lib/auth/api-guard";
import { NextRequest } from "next/server";
import {
    NextResponse,
} from 'next/server';

import {
    createClient,
} from '@/lib/supabase/server';

import type {
    NotificationSearchFilters,
} from '@/types/crm/Notifications';



export const GET = withTenantGuard(async (request: NextRequest) => {

    const supabase =
        await createClient();

    const service = createNotificationsService(supabase);

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

            ? await service.search(filters)

            : await service.list()

    return NextResponse.json(
        notifications,
    );

}
);
export const POST = withTenantGuard(async (request: NextRequest) => {

    const supabase =
        await createClient();

    const service = createNotificationsService(supabase);

    const body =
        await request.json();

    const notification =
        await service.create(body);

    return NextResponse.json(

        notification,

        {
            status: 201,
        },

    );
})

