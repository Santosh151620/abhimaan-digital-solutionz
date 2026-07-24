import type {
    Activity,
    ActivityStatus,
    ActivitySearchFilters,
    ActivitySummary,
} from '@/types/crm/Activities';



class ActivitiesRepository {


    private readonly activities =
        new Map<string, Activity>();



    list(): Activity[] {

        return [
            ...this.activities.values(),
        ]
        .filter(
            activity =>
                !activity.archived,
        );

    }





    listArchived(): Activity[] {

        return [
            ...this.activities.values(),
        ]
        .filter(
            activity =>
                activity.archived,
        );

    }





    details(
        id: string,
    ): Activity | null {

        return (
            this.activities.get(id)
            ??
            null
        );

    }





    findById(
        id: string,
    ): Activity | null {

        return this.details(
            id,
        );

    }





    search(
        filters?: ActivitySearchFilters,
    ): Activity[] {


        let activities =
            this.list();



        if(filters?.status){

            activities =
                activities.filter(
                    activity =>
                        activity.status ===
                        filters.status,
                );

        }




        if(filters?.type){

            activities =
                activities.filter(
                    activity =>
                        activity.type ===
                        filters.type,
                );

        }




        if(filters?.priority){

            activities =
                activities.filter(
                    activity =>
                        activity.priority ===
                        filters.priority,
                );

        }




        if(filters?.entityType){

            activities =
                activities.filter(
                    activity =>
                        activity.entityType ===
                        filters.entityType,
                );

        }




        if(filters?.entityId){

            activities =
                activities.filter(
                    activity =>
                        activity.entityId ===
                        filters.entityId,
                );

        }




        if(filters?.assignedTo){

            activities =
                activities.filter(
                    activity =>
                        activity.assignedTo ===
                        filters.assignedTo,
                );

        }




        if(filters?.search){

            const keyword =
                filters.search
                    .trim()
                    .toLowerCase();



            activities =
                activities.filter(
                    activity =>

                        activity.title
                            .toLowerCase()
                            .includes(keyword)

                        ||

                        (
                            activity.description
                                ?.toLowerCase()
                                .includes(keyword)
                            ??
                            false
                        )

                        ||

                        activity.activityNumber
                            .toLowerCase()
                            .includes(keyword)

                );

        }



        return activities;

    }





    create(
        data: Partial<Activity>,
    ): Activity {


        const now =
            new Date()
                .toISOString();



        const activity: Activity = {


            id:
                data.id
                ??
                crypto.randomUUID(),



            activityNumber:

                data.activityNumber
                ??
                `ACT-${Date.now()}`,




            entityType:

                data.entityType
                ??
                'Activity',




            entityId:

                data.entityId
                ??
                crypto.randomUUID(),




            companyId:
                data.companyId,



            contactId:
                data.contactId,



            projectId:
                data.projectId,



            assignedTo:
                data.assignedTo,



            title:

                data.title
                ??
                '',




            description:
                data.description,



            type:

                data.type
                ??
                'Other',




            status:

                data.status
                ??
                'Planned',




            priority:

                data.priority
                ??
                'Medium',




            startDate:
                data.startDate,



            location:
                data.location,



            reminderMinutes:
                data.reminderMinutes,



            completedAt:
                data.completedAt,



            archived:
                false,



            createdAt:
                now,



            updatedAt:
                now,


        };



        this.activities.set(
            activity.id,
            activity,
        );



        return activity;

    }





    update(
        id: string,
        data: Partial<Activity>,
    ): Activity | null {


        const existing =
            this.activities.get(id);



        if(!existing){

            return null;

        }



        const updated: Activity = {


            ...existing,

            ...data,


            updatedAt:

                new Date()
                    .toISOString(),


        };



        this.activities.set(
            id,
            updated,
        );



        return updated;

    }





    updateStatus(
        id: string,
        status: ActivityStatus,
    ): Activity | null {


        return this.update(
            id,
            {
                status,
            },
        );

    }





    delete(
        id: string,
    ): boolean {


        const activity =
            this.activities.get(id);



        if(!activity){

            return false;

        }



        activity.archived =
            true;



        activity.updatedAt =
            new Date()
                .toISOString();



        this.activities.set(
            id,
            activity,
        );



        return true;

    }





    restore(
        id: string,
    ): boolean {


        const activity =
            this.activities.get(id);



        if(!activity){

            return false;

        }



        activity.archived =
            false;



        activity.updatedAt =
            new Date()
                .toISOString();



        this.activities.set(
            id,
            activity,
        );



        return true;

    }





       summary(): ActivitySummary {


        const activities =
            this.list();



        const today =
            new Date()
                .toISOString()
                .substring(0, 10);



        return {


            total:
                activities.length,



            planned:

                activities.filter(
                    item =>
                        item.status === 'Planned',
                ).length,



            inProgress:

                activities.filter(
                    item =>
                        item.status === 'In Progress',
                ).length,



            completed:

                activities.filter(
                    item =>
                        item.status === 'Completed',
                ).length,



            cancelled:

                activities.filter(
                    item =>
                        item.status === 'Cancelled',
                ).length,



            missed:

                activities.filter(
                    item =>
                        item.status === 'Missed',
                ).length,



            overdue:

                activities.filter(
                    item =>

                        !!item.startDate

                        &&

                        item.startDate < today

                        &&

                        item.status !== 'Completed'

                        &&

                        item.status !== 'Cancelled',

                ).length,



            today:

                activities.filter(
                    item =>

                        item.startDate === today,

                ).length,



            upcoming:

                activities.filter(
                    item =>

                        !!item.startDate

                        &&

                        item.startDate > today,

                ).length,



            highPriority:

                activities.filter(
                    item =>

                        item.priority === 'High'

                        ||

                        item.priority === 'Critical',

                ).length,
            completionRate:

                activities.length === 0

                    ? 0

                    : Math.round(

                        (
                            activities.filter(
                                item =>
                                    item.status === 'Completed',
                            ).length
                            /
                            activities.length
                        )
                        *
                        100

                    ),
                    
            archived:

                this.listArchived().length,


        };

    }


}




const activitiesRepository =
    new ActivitiesRepository();



/**
 * New architecture export
 */
export const ActivitiesRepositoryInstance =
    activitiesRepository;


/**
 * Internal/service compatibility
 */
export {
    activitiesRepository,
};


/**
 * Temporary legacy compatibility.
 * Remove only after final audit.
 */
export const ActivityRepositoryInstance =
    activitiesRepository;