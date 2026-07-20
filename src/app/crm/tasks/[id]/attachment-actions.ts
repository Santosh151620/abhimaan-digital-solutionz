'use server';


import {
    AttachmentServiceInstance,
} from '@/services/crm/AttachmentService';



export async function getTaskAttachments(
    taskId:string
) {

    return AttachmentServiceInstance.list(

        'Task',

        taskId

    );

}



export async function createTaskAttachment(
    taskId:string,
    data:{
        fileName:string;
        fileUrl:string;
        fileSize?:number;
    }
) {


    return AttachmentServiceInstance.create({

        entityType:
            'Task',

        entityId:
            taskId,

        fileName:
            data.fileName,

        fileUrl:
            data.fileUrl,

        fileSize:
            data.fileSize,

    });


}



export async function deleteTaskAttachment(
    id:string
) {

    return AttachmentServiceInstance.delete(
        id
    );

}