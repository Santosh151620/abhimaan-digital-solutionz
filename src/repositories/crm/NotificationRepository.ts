import type {

    Notification,

} from '@/types/crm/Notification';



class NotificationRepository {



    private notifications =

        new Map<string, Notification>();





    list(): Notification[] {


        return Array.from(

            this.notifications.values(),

        );


    }





    getById(

        id: string,

    ): Notification | undefined {


        return this.notifications.get(

            id,

        );


    }





    create(

        data: Partial<Notification>,

    ): Notification {



        const notification: Notification = {


            id:

                crypto.randomUUID(),



            organizationId:

                data.organizationId,



            userId:

                data.userId,



            entityType:

                data.entityType,



            entityId:

                data.entityId,



            title:

                data.title ?? '',



            message:

                data.message ?? '',



            type:

                data.type ?? 'Info',



            priority:

                data.priority ?? 'Medium',



            read:

                data.read ?? false,



            createdAt:

                new Date().toISOString(),



            updatedAt:

                new Date().toISOString(),


        };



        this.notifications.set(

            notification.id,

            notification,

        );



        return notification;


    }





    update(

        id: string,

        data: Partial<Notification>,

    ): Notification | undefined {


        const existing =

            this.notifications.get(

                id,

            );



        if (!existing) {


            return undefined;


        }





        const updated: Notification = {


            ...existing,

            ...data,

            updatedAt:

                new Date().toISOString(),


        };



        this.notifications.set(

            id,

            updated,

        );



        return updated;


    }





    delete(

        id: string,

    ): boolean {


        return this.notifications.delete(

            id,

        );


    }


}





export const NotificationRepositoryInstance =

    new NotificationRepository();