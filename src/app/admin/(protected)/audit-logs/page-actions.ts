"use server";


import type {
    AuditLog,
} from "@/types/admin/AuditLog";


import {
    auditLogsService,
} from "@/services/admin/AuditLogsService";



export async function getAuditLogs(): Promise<AuditLog[]> {

    return auditLogsService.list();

}



export async function getEntityAuditLogs(

    entityType: string,

    entityId: string,

): Promise<AuditLog[]> {

    return auditLogsService.findByEntity(

        entityType,

        entityId,

    );

}