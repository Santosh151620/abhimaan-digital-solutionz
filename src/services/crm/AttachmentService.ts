import type {
    Attachment,
} from '@/types/crm/Attachment';



class AttachmentService {


    private attachments =
        new Map<string, Attachment>();



    list() {


        return Array.from(
            this.attachments.values(),
        ).filter(
            item => !item.archived,
        );


    }



    listByEntity(

        entityType: string,

        entityId: string,

    ) {


        return this.list().filter(

            item =>

                item.entityType === entityType &&

                item.entityId === entityId,

        );


    }



    details(

        id: string,

    ) {


        return (

            this.attachments.get(
                id,
            ) ?? null

        );


    }



    create(

        data: Partial<Attachment>,

    ) {


        const now =
            new Date().toISOString();



        const attachment: Attachment = {


            id:
                crypto.randomUUID(),



            entityType:
                data.entityType ?? 'Other',



            entityId:
                data.entityId ?? '',



            fileName:
                data.fileName ?? '',



            fileUrl:
                data.fileUrl ?? '',



            fileType:
                data.fileType,



            fileSize:
                data.fileSize,



            description:
                data.description,



            uploadedBy:
                data.uploadedBy,



            archived:
                false,



            createdAt:
                now,



            updatedAt:
                now,


        };



        this.attachments.set(

            attachment.id,

            attachment,

        );



        return attachment;


    }



    update(

        id: string,

        data: Partial<Attachment>,

    ) {


        const existing =

            this.attachments.get(
                id,
            );



        if (!existing) {


            return null;


        }



        const updated = {


            ...existing,

            ...data,


            updatedAt:

                new Date().toISOString(),


        };



        this.attachments.set(

            id,

            updated,

        );



        return updated;


    }



    delete(

        id: string,

    ) {


        const attachment =

            this.attachments.get(
                id,
            );



        if (!attachment) {


            return false;


        }



        attachment.archived = true;



        attachment.updatedAt =

            new Date().toISOString();



        this.attachments.set(

            id,

            attachment,

        );



        return true;


    }



    summary() {


        const attachments =

            Array.from(
                this.attachments.values(),
            );



        return {


            total:
                attachments.length,



            active:
                attachments.filter(
                    item => !item.archived,
                ).length,



            archived:
                attachments.filter(
                    item => item.archived,
                ).length,


        };


    }


}



export const

    AttachmentServiceInstance =

        new AttachmentService();
