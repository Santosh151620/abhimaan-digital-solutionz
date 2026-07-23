import {
    ActivityRepositoryInstance,
} from '@/repositories/crm/ActivityRepository';


import type {
    Activity,
    ActivityStatus,
} from '@/types/crm/Activity';



class ActivityService {


    list() {

        return ActivityRepositoryInstance.list();

    }



    listArchived() {

        return ActivityRepositoryInstance.listArchived();

    }



    details(
        id: string,
    ) {

        return ActivityRepositoryInstance.details(
            id,
        );

    }



    create(
        data: Partial<Activity>,
    ) {

        return ActivityRepositoryInstance.create(
            data,
        );

    }



    update(
        id: string,
        data: Partial<Activity>,
    ) {

        return ActivityRepositoryInstance.update(
            id,
            data,
        );

    }



    updateStatus(
        id: string,
        status: ActivityStatus,
    ) {

        return ActivityRepositoryInstance.updateStatus(
            id,
            status,
        );

    }



    delete(
        id: string,
    ) {

        return ActivityRepositoryInstance.delete(
            id,
        );

    }



    restore(
        id: string,
    ) {

        return ActivityRepositoryInstance.restore(
            id,
        );

    }



    summary() {

        return ActivityRepositoryInstance.summary();

    }


}



export async function createActivityService() {

    return new ActivityService();

}



export const
    ActivityServiceInstance =
        new ActivityService();