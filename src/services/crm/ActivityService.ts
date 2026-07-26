import {
    createClient,
} from '@/lib/supabase/server';

import {
    createActivitiesRepository,
} from '@/repositories/crm/ActivitiesRepository';

import type {
    Activity,
    ActivitySearchFilters,
    ActivityStatus,
    ActivitySummary,
} from '@/types/crm/Activities';



class ActivityService {


    private async repository() {

        const supabase =
            await createClient();


        return createActivitiesRepository(
            supabase,
        );

    }





    async list(): Promise<Activity[]> {

        const repo =
            await this.repository();


        return repo.list();

    }





    async listArchived(): Promise<Activity[]> {

        const repo =
            await this.repository();


        return repo.listArchived();

    }





    async details(
        id: string,
    ): Promise<Activity | null> {

        const repo =
            await this.repository();


        return repo.findById(
            id,
        );

    }





    async findById(
        id: string,
    ): Promise<Activity | null> {

        return this.details(
            id,
        );

    }





    async search(
        filters?: ActivitySearchFilters,
    ): Promise<Activity[]> {

        const repo =
            await this.repository();


        return repo.search(
            filters,
        );

    }





    async create(
        data: Partial<Activity>,
    ): Promise<Activity> {

        const repo =
            await this.repository();


        return repo.create(
            data,
        );

    }





    async update(
        id: string,
        data: Partial<Activity>,
    ): Promise<Activity | null> {

        const repo =
            await this.repository();


        return repo.update(
            id,
            data,
        );

    }





    async updateStatus(
        id: string,
        status: ActivityStatus,
    ): Promise<Activity | null> {

        const repo =
            await this.repository();


        return repo.updateStatus(
            id,
            status,
        );

    }





    async delete(
        id: string,
    ): Promise<boolean> {

        const repo =
            await this.repository();


        await repo.delete(
            id,
        );


        return true;

    }





    async restore(
        id: string,
    ): Promise<boolean> {

        const repo =
            await this.repository();


        return repo.restore(
            id,
        );

    }





    async summary(): Promise<ActivitySummary> {

        const repo =
            await this.repository();


        return repo.summary();

    }


}





/**
 * Standard service instance.
 */
export const activitiesService =
    new ActivityService();





/**
 * New architecture export.
 */
export const ActivitiesServiceInstance =
    activitiesService;





/**
 * Existing CRM compatibility export.
 *
 * Existing routes/pages already consume this.
 */
export const ActivityServiceInstance =
    activitiesService;