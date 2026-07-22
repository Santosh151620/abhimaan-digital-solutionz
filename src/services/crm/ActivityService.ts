import {
    ActivityRepository,
} from '@/repositories/activity.repository';

import type {
    Activity,
} from '@/types/activity';

export class ActivityService {

    constructor(
        private readonly repository: ActivityRepository,
    ) {}

    findByEntity(
        entityType: string,
        entityId: string,
    ): Promise<Activity[]> {

        return this.repository.findByEntity(
            entityType,
            entityId,
        );

    }

}

export default ActivityService;