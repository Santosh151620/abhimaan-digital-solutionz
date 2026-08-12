"use server";


import type {

    AuditLog,

} from "@/types/admin/AuditLog";



import {

    AuditLogsRepository,

} from "@/repositories/admin/AuditLogsRepository";





const repository =

    new AuditLogsRepository();







export async function getAuditLogs():Promise<AuditLog[]> {



    return await repository.findAll();



}







async function getEntityAuditLogs(



    entityType:string,



    entityId:string,



):Promise<AuditLog[]> {



    return await repository.findByEntity(



        entityType,



        entityId,



    );



}