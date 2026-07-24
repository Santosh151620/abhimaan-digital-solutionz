import {
    activitiesRepository,
} from '@/repositories/crm/ActivitiesRepository';

import type {
    Activity,
    ActivitySearchFilters,
    ActivityStatus,
    ActivitySummary,
} from '@/types/crm/Activities';

class ActivitiesService {

    list(): Activity[] {

        return activitiesRepository.list();

    }

    listArchived(): Activity[] {

        return activitiesRepository.listArchived();

    }

    findById(
        id: string,
    ): Activity | null {

        return activitiesRepository.findById(
            id,
        );

    }

    details(
        id: string,
    ): Activity | null {

        return this.findById(
            id,
        );

    }

    search(
        filters?: ActivitySearchFilters,
    ): Activity[] {

        return activitiesRepository.search(
            filters,
        );

    }

    create(
        data: Partial<Activity>,
    ): Activity {

        return activitiesRepository.create(
            data,
        );

    }

    update(
        id: string,
        data: Partial<Activity>,
    ): Activity | null {

        return activitiesRepository.update(
            id,
            data,
        );

    }

    updateStatus(
        id: string,
        status: ActivityStatus,
    ): Activity | null {

        return activitiesRepository.updateStatus(
            id,
            status,
        );

    }

    delete(
        id: string,
    ): boolean {

        return activitiesRepository.delete(
            id,
        );

    }

    restore(
        id: string,
    ): boolean {

        return activitiesRepository.restore(
            id,
        );

    }

    summary(): ActivitySummary {

        return activitiesRepository.summary();

    }

}
export async function createActivitiesService():
    Promise<ActivitiesService> {

    return new ActivitiesService();

}

export const activitiesService =
    new ActivitiesService();

/**
 * Preferred standardized export.
 */
export const ActivitiesServiceInstance =
    activitiesService;

/**
 * Legacy compatibility.
 * Remove during the final legacy cleanup sprint.
 */
export const ActivityServiceInstance =
    activitiesService;
