'use server';


import {
    AttachmentServiceInstance,
} from '@/services/crm/AttachmentService';

import type {
    Attachment,
} from '@/types/crm/Attachment';

export async function getAttachments() {
    return AttachmentServiceInstance.list();

}
export async function getAttachment(

    id: string,

) {

    return AttachmentServiceInstance.details(
        id,
    );
}

export async function getEntityAttachments(

    entityType: string,
    entityId: string,

) {
    return AttachmentServiceInstance.listByEntity(

        entityType,

        entityId,

    );

}

export async function createAttachment(

    data: Partial<Attachment>,

) {

    return AttachmentServiceInstance.create(
        data,
    );
}

export async function updateAttachment(

    id: string,

    data: Partial<Attachment>,

) {

    return AttachmentServiceInstance.update(

        id,

        data,

    );


}

export async function deleteAttachment(

    id: string,

) {

    return AttachmentServiceInstance.delete(
        id,
    );
}

export async function getAttachmentSummary() {

    return AttachmentServiceInstance.summary();
}