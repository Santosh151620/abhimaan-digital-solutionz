"use server";


import {
    createClient,
} from "@/lib/supabase/server";


import {
    AttachmentsService,
} from "@/services/attachments.service";


import type {
    Attachment,
    AttachmentSearchFilters,
} from "@/types/crm/Attachment";



async function getService() {

    const supabase =
        await createClient();


    return new AttachmentsService(
        supabase,
    );

}



export async function getAttachments() {

    const service =
        await getService();


    return service.list();

}



export async function getAttachment(
    id: string,
) {

    const service =
        await getService();


    return service.details(
        id,
    );

}



export async function getEntityAttachments(

    entityType: string,

    entityId: string,

) {

    const service =
        await getService();


    return service.findByEntity(
        entityType,
        entityId,
    );

}



export async function searchAttachments(

    filters?: AttachmentSearchFilters,

) {

    const service =
        await getService();


    return service.search(
        filters,
    );

}



export async function createAttachment(

    data: Partial<Attachment>,

) {

    const service =
        await getService();


    return service.create(
        data,
    );

}



export async function updateAttachment(

    id: string,

    data: Partial<Attachment>,

) {

    const service =
        await getService();


    return service.update(
        id,
        data,
    );

}



export async function deleteAttachment(

    id: string,

) {

    const service =
        await getService();


    return service.delete(
        id,
    );

}



export async function getAttachmentSummary() {

    const service =
        await getService();


    return service.summary();

}