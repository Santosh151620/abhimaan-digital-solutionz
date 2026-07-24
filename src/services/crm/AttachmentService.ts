import {
    AttachmentRepositoryInstance,
} from '@/repositories/crm/AttachmentRepository';


import type {
    Attachment,
} from '@/types/crm/Attachment';



class AttachmentService {



    list(
        entityType?: string,
        entityId?: string,
    ) {


        if (
            entityType &&
            entityId
        ) {

            return AttachmentRepositoryInstance
                .list(
                    entityType,
                    entityId,
                )
                .filter(
                    item =>
                        !item.archived,
                );

        }



        return [];

    }





    listByEntity(

        entityType: string,

        entityId: string,

    ) {


        return AttachmentRepositoryInstance
            .list(
                entityType,
                entityId,
            )
            .filter(
                item =>
                    !item.archived,
            );


    }





    details(

        id: string,

    ) {


        return AttachmentRepositoryInstance
            .list(
                '',
                '',
            )
            .find(
                item =>
                    item.id === id,
            )
            ?? null;


    }





    create(

        data: Partial<Attachment>,

    ) {


        return AttachmentRepositoryInstance.create(
            data,
        );


    }





    update(

        id: string,

        data: Partial<Attachment>,

    ) {


        const attachments =
            AttachmentRepositoryInstance
                .list(
                    data.entityType ?? '',
                    data.entityId ?? '',
                );


        const existing =
            attachments.find(
                item =>
                    item.id === id,
            );



        if (!existing) {

            return null;

        }



        return Object.assign(
            existing,
            data,
            {
                updatedAt:
                    new Date().toISOString(),
            },
        );


    }





    delete(

        id: string,

    ) {


        return AttachmentRepositoryInstance.delete(
            id,
        );


    }





    summary() {


        const attachments =
            AttachmentRepositoryInstance
                .list(
                    '',
                    '',
                );



        return {


            total:
                attachments.length,



            active:
                attachments.filter(
                    item =>
                        !item.archived,
                ).length,



            archived:
                attachments.filter(
                    item =>
                        item.archived,
                ).length,


        };


    }


}





export const
    AttachmentServiceInstance =
        new AttachmentService();