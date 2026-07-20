import {
    AttachmentRepositoryInstance,
} from '@/repositories/crm/AttachmentRepository';


import type {
    Attachment,
} from '@/types/crm/Attachment';



class AttachmentService {


    list(
        entityType:string,
        entityId:string
    ) {

        return AttachmentRepositoryInstance.list(
            entityType,
            entityId
        );

    }



    create(
        data:Partial<Attachment>
    ) {

        return AttachmentRepositoryInstance.create(
            data
        );

    }



    delete(
        id:string
    ) {

        return AttachmentRepositoryInstance.delete(
            id
        );

    }


}



export const
    AttachmentServiceInstance =
        new AttachmentService();