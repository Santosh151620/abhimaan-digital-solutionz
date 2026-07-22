import {
    ActivityRepository as BaseActivityRepository,
} from '@/repositories/activity.repository';

import type {
    SupabaseClient,
} from '@supabase/supabase-js';

export class ActivityRepository extends BaseActivityRepository {

    constructor(
        supabase: SupabaseClient,
    ) {
        super(supabase);
    }

}