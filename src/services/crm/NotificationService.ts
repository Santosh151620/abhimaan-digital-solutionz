import type {

    Notification,

} from '@/types/crm/Notification';



import {

    NotificationRepositoryInstance,

} from '@/repositories/crm/NotificationRepository';




class NotificationService {



    async list(): Promise<Notification[]> {


        return NotificationRepositoryInstance.list();


    }





    async getById(

        id: string,

    ): Promise<Notification | undefined> {


        return NotificationRepositoryInstance.getById(

            id,

        );


    }





    async create(

        data: Partial<Notification>,

    ): Promise<Notification> {


        return NotificationRepositoryInstance.create(

            data,

        );


    }





    async update(

        id: string,

        data: Partial<Notification>,

    ): Promise<Notification | undefined> {


        return NotificationRepositoryInstance.update(

            id,

            data,

        );


    }





    async delete(

        id: string,

    ): Promise<boolean> {


        return NotificationRepositoryInstance.delete(

            id,

        );


    }





}



export const notificationService =

    new NotificationService();