import type {
    Attachment,
} from '@/types/crm/Attachment';


class AttachmentService {


    private attachments =
        new Map<string, Attachment>();



    list(): Attachment[] {

        return Array.from(
            this.attachments.values(),
        )
        .filter(
            item =>
                !item.archived,
        );

    }



    listByEntity(
        entityType: string,
        entityId: string,
    ): Attachment[] {

        return this.list()
            .filter(
                item =>

                    item.entityType === entityType

                    &&

                    item.entityId === entityId,

            );

    }



    details(
        id: string,
    ): Attachment | null {

        return (
            this.attachments.get(id)
            ??
            null
        );

    }



    create(
        data: Partial<Attachment>,
    ): Attachment {


        const now =
            new Date()
                .toISOString();



        const attachment: Attachment = {


            id:
                crypto.randomUUID(),



            entityType:
                data.entityType
                ??
                'Other' as Attachment['entityType'],



            entityId:
                data.entityId
                ??
                '',



            fileName:
                data.fileName
                ??
                '',



            fileUrl:
                data.fileUrl
                ??
                '',



            fileType:
                data.fileType
                ??
                'application/octet-stream',



            fileSize:
                data.fileSize,



            description:
                data.description,



            uploadedBy:
                data.uploadedBy,



            uploadedAt:
                data.uploadedAt
                ??
                now,



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
    ): Attachment | null {


        const existing =
            this.attachments.get(
                id,
            );


        if (!existing) {

            return null;

        }



        const updated: Attachment = {

            ...existing,

            ...data,


            updatedAt:
                new Date()
                    .toISOString(),

        };



        this.attachments.set(
            id,
            updated,
        );



        return updated;

    }



    delete(
        id: string,
    ): boolean {


        const attachment =
            this.attachments.get(
                id,
            );


        if (!attachment) {

            return false;

        }



        attachment.archived =
            true;



        attachment.updatedAt =
            new Date()
                .toISOString();



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
                    item =>
                        !item.archived,
                )
                .length,



            archived:
                attachments.filter(
                    item =>
                        item.archived,
                )
                .length,

        };

    }


}



export const AttachmentServiceInstance =
    new AttachmentService();