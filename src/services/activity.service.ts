import type { SupabaseClient } from "@supabase/supabase-js";

import {
    createActivitiesRepository,
} from "@/repositories/crm/ActivitiesRepository";

import type {
    Activity,
} from "@/types/crm/Activities";


export class ActivityService {

    private readonly repository:
        ReturnType<
            typeof createActivitiesRepository
        >;


    constructor(
        supabase: SupabaseClient,
    ) {

        this.repository =
            createActivitiesRepository(
                supabase,
            );

    }


    async getByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Activity[]> {

        return this.repository.findByEntity(
            entityType,
            entityId,
        );

    }


    async create(
        activity: Partial<Activity>,
    ): Promise<Activity> {

        return this.repository.create(
            activity,
        );

    }

}


export function createActivityService(
    supabase: SupabaseClient,
) {

    return new ActivityService(
        supabase,
    );

}