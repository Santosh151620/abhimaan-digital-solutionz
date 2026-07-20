import type {
    Activity,
} from '@/types/crm/Activity';



class ActivityRepository {


    private activities =
        new Map<string, Activity>();



    list(
        entityType:string,
        entityId:string
    ) {


        return Array.from(
            this.activities.values()
        )
        .filter(

            activity =>

                activity.entityType === entityType

                &&

                activity.entityId === entityId

        );

    }



    create(
        data:Partial<Activity>
    ) {


        const activity:Activity = {


            id:
                crypto.randomUUID(),


            entityType:
                data.entityType ?? '',


            entityId:
                data.entityId ?? '',


            action:
                data.action ?? 'Created',


            description:
                data.description ?? '',


            performedBy:
                data.performedBy,


            createdAt:
                new Date().toISOString(),


        };



        this.activities.set(

            activity.id,

            activity

        );



        return activity;


    }


}


export const
    ActivityRepositoryInstance =
        new ActivityRepository();