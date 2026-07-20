import {
    ActivityRepositoryInstance,
} from '@/repositories/crm/ActivityRepository';



import type {
    Activity,
} from '@/types/crm/Activity';



class ActivityService {


    list(
        entityType:string,
        entityId:string
    ) {

        return ActivityRepositoryInstance.list(
            entityType,
            entityId
        );

    }



    create(
        data:Partial<Activity>
    ) {

        return ActivityRepositoryInstance.create(
            data
        );

    }


}



export const
    ActivityServiceInstance =
        new ActivityService();