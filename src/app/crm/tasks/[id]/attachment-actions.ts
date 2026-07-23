'use server';


import {

    AttachmentRepositoryInstance,

} from '@/repositories/crm/AttachmentRepository';



export async function getTaskAttachments(

    taskId: string,

) {


    return AttachmentRepositoryInstance.list(

        'Task',

        taskId,

    );


}




export async function createTaskAttachment(

    data: {

        fileName: string;

        fileUrl: string;

        fileType?: string;

        fileSize?: number;

        taskId: string;

    },

) {


    return AttachmentRepositoryInstance.create({

        entityType: 'Task',

        entityId: data.taskId,

        fileName: data.fileName,

        fileUrl: data.fileUrl,

        fileSize: data.fileSize,

    });


}




export async function deleteTaskAttachment(

    id: string,

) {


    return AttachmentRepositoryInstance.delete(

        id,

    );


}