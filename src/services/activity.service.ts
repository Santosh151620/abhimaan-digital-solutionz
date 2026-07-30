import type { Activity } from "@/types/crm/Activities";
import { ActivitiesRepository } from "@/repositories/crm/ActivitiesRepository";


export class ActivityService {


    constructor(
        private readonly repository: ActivitiesRepository,
    ) {}


    getByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Activity[]> {

        return this.repository.findByEntity(
            entityType,
            entityId,
        );

    }


    create(
        activity: Partial<Activity>,
    ): Promise<Activity> {

        return this.repository.create(
            activity,
        );

    }

}

