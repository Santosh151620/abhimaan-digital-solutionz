import type {
    Attachment,
} from '@/types/crm/Attachment';



export class AttachmentRepository {


    private attachments =
        new Map<string, Attachment>();



    list(
        entityType: string,
        entityId: string
    ) {


        return Array.from(
            this.attachments.values()
        )
            .filter(

                attachment =>

                    attachment.entityType === entityType

                    &&

                    attachment.entityId === entityId

            );


    }




    create(
        data: Partial<Attachment>
    ) {


        const attachment: Attachment = {


            id:
                crypto.randomUUID(),


            entityType:
                data.entityType || 'Other',


            entityId:
                data.entityId ?? '',


            fileName:
                data.fileName ?? '',


            fileUrl:
                data.fileUrl ?? '',


            fileSize:
                data.fileSize,


            uploadedBy:
                data.uploadedBy,


            archived:
                false,


            createdAt:
                new Date().toISOString(),


            updatedAt:
                new Date().toISOString(),


        };



        this.attachments.set(

            attachment.id,

            attachment

        );



        return attachment;


    }




    delete(
        id: string
    ) {


        return this.attachments.delete(
            id
        );


    }


}



export const
    AttachmentRepositoryInstance =
        new AttachmentRepository();