import type {
    Activity,
    ActivityStatus,
} from '@/types/crm/Activity';


class ActivityRepository {


    private activities =
        new Map<string, Activity>();



    list() {

        return Array.from(
            this.activities.values(),
        ).filter(
            activity => !activity.archived,
        );

    }



    listArchived() {

        return Array.from(
            this.activities.values(),
        ).filter(
            activity => activity.archived,
        );

    }



    details(
        id: string,
    ) {

        return (
            this.activities.get(id)
            ?? null
        );

    }



    create(
        data: Partial<Activity>,
    ): Activity {


        const now =
            new Date().toISOString();



        const activity: Activity = {


            id:
                crypto.randomUUID(),



            activityNumber:
                data.activityNumber
                ??
                `ACT-${Date.now()}`,



            entityType:
                data.entityType,



            entityId:
                data.entityId,



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



            endDate:
                data.endDate,



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
    ) {


        const existing =
            this.activities.get(id);



        if (!existing) {

            return null;

        }



        const updated: Activity = {


            ...existing,

            ...data,


            updatedAt:
                new Date().toISOString(),


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
    ) {


        return this.update(
            id,
            {
                status,
            },
        );


    }




    delete(
        id: string,
    ) {


        const activity =
            this.activities.get(id);



        if (!activity) {

            return false;

        }



        activity.archived =
            true;



        activity.updatedAt =
            new Date().toISOString();



        this.activities.set(
            id,
            activity,
        );



        return true;


    }




    restore(
        id: string,
    ) {


        const activity =
            this.activities.get(id);



        if (!activity) {

            return false;

        }



        activity.archived =
            false;



        activity.updatedAt =
            new Date().toISOString();



        this.activities.set(
            id,
            activity,
        );



        return true;


    }




    summary() {


        const activities =
            this.list();



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


        };


    }


}



export const
    ActivityRepositoryInstance =
        new ActivityRepository();