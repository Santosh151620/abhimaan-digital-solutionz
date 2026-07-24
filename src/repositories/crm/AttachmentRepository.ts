import type {
    Attachment,
    AttachmentEntityType,
    AttachmentSummary,
} from '@/types/crm/Attachment';



export interface AttachmentSearchFilters {

    entityType?: AttachmentEntityType;

    entityId?: string;

    uploadedBy?: string;

}





class AttachmentRepository {



    private attachments =
        new Map<string, Attachment>();





    async list(
        entityType?: AttachmentEntityType,
        entityId?: string,
    ): Promise<Attachment[]> {


        let attachments =
            Array.from(
                this.attachments.values(),
            )
            .filter(
                attachment =>
                    !attachment.archived,
            );



        if (entityType) {


            attachments =
                attachments.filter(
                    attachment =>
                        attachment.entityType === entityType,
                );


        }



        if (entityId) {


            attachments =
                attachments.filter(
                    attachment =>
                        attachment.entityId === entityId,
                );


        }



        return attachments;


    }





    async listArchived(): Promise<Attachment[]> {


        return Array.from(
            this.attachments.values(),
        )
        .filter(
            attachment =>
                attachment.archived,
        );


    }





    async findById(
        id: string,
    ): Promise<Attachment | null> {


        return (
            this.attachments.get(id)
            ??
            null
        );


    }





    async listByEntity(
        entityType: AttachmentEntityType,
        entityId: string,
    ): Promise<Attachment[]> {


        return this.list(
            entityType,
            entityId,
        );


    }





    async search(
        filters?: AttachmentSearchFilters,
    ): Promise<Attachment[]> {


        let result =
            await this.list();



        if (filters?.entityType) {


            result =
                result.filter(
                    attachment =>
                        attachment.entityType ===
                        filters.entityType,
                );


        }



        if (filters?.entityId) {


            result =
                result.filter(
                    attachment =>
                        attachment.entityId ===
                        filters.entityId,
                );


        }



        if (filters?.uploadedBy) {


            result =
                result.filter(
                    attachment =>
                        attachment.uploadedBy ===
                        filters.uploadedBy,
                );


        }



        return result;


    }





    async summary(): Promise<AttachmentSummary> {


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
                ).length,



            archived:
                attachments.filter(
                    item =>
                        item.archived,
                ).length,


        };


    }





    async create(
        data: Partial<Attachment>,
    ): Promise<Attachment> {


        const now =
            new Date().toISOString();



        const attachment: Attachment = {


            id:
                crypto.randomUUID(),



            entityType:
                data.entityType
                ??
                'Other',



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





    async update(
        id: string,
        data: Partial<Attachment>,
    ): Promise<Attachment | null> {


        const existing =
            this.attachments.get(id);



        if (!existing) {

            return null;

        }



        const updated: Attachment = {


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





    async delete(
        id: string,
    ): Promise<boolean> {


        const attachment =
            this.attachments.get(id);



        if (!attachment) {

            return false;

        }



        attachment.archived =
            true;



        attachment.updatedAt =
            new Date().toISOString();



        this.attachments.set(
            id,
            attachment,
        );



        return true;


    }





    async restore(
        id: string,
    ): Promise<boolean> {


        const attachment =
            this.attachments.get(id);



        if (!attachment) {

            return false;

        }



        attachment.archived =
            false;



        attachment.updatedAt =
            new Date().toISOString();



        this.attachments.set(
            id,
            attachment,
        );



        return true;


    }


}





export const AttachmentRepositoryInstance =
    new AttachmentRepository();