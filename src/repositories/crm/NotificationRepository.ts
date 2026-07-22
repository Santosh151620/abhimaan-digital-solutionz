import {
    NotificationsRepository as BaseNotificationsRepository,
} from '@/repositories/notifications.repository';

import type {
    SupabaseClient,
} from '@supabase/supabase-js';

export class NotificationRepository extends BaseNotificationsRepository {

    constructor(
        supabase: SupabaseClient,
    ) {
        super(supabase);
    }

}