/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 *
 * Supabase Audit Repository
 *
 * Implements:
 * IAuditRepository
 *
 * Database:
 * audit.audit_events
 *
 * Rules:
 * - Immutable audit records
 * - Organization isolated
 * - No update/delete operations
 * ============================================================================
 */

import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import type {
    AuditRecord,
} from "@/types/admin/Audit";


import type {
    IAuditRepository,
} from "./AuditRepository";


import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";



export class SupabaseAuditRepository
implements IAuditRepository {


    constructor(
        private readonly supabase: SupabaseClient
    ) {}



    async log(
        entry: AuditRecord
    ): Promise<void> {


        const organizationId =
            TenantContextManager
                .require()
                .organizationId;



        const {
            error,
        } = await this.supabase
            .schema("audit")
            .from("audit_events")
            .insert({

                organization_id:
                    organizationId,


                actor_id:
                    entry.actorId ??
                    entry.userId,


                actor_type:
                    entry.actorType ??
                    "USER",


                event_type:
                    entry.eventType ??
                    entry.actionType,


                event_category:
                    entry.eventCategory ??
                    entry.module,


                entity_type:
                    entry.entityType ??
                    entry.entity,


                entity_id:
                    entry.entityId,


                action:
                    entry.action,


                description:
                    entry.description,


                old_values:
                    entry.beforeData ?? {},


                new_values:
                    entry.afterData ?? {},


                ip_address:
                    entry.ipAddress,


                user_agent:
                    entry.userAgent,


                source_module:
                    entry.sourceModule ??
                    entry.module,


                severity:
                    entry.severity
                        .toUpperCase(),


                metadata:
                    entry.metadata ?? {},

            });



        if (error) {

            throw error;

        }

    }




    async getLogs(
        options?: {
            entityType?: string;

            entityId?: string;

            limit?: number;
        }
    ): Promise<AuditRecord[]> {


        const organizationId =
            TenantContextManager
                .require()
                .organizationId;



        let query =
            this.supabase
                .schema("audit")
                .from("audit_events")
                .select("*")
                .eq(
                    "organization_id",
                    organizationId
                )
                .order(
                    "created_at",
                    {
                        ascending: false,
                    }
                );



        if (options?.entityType) {

            query =
                query.eq(
                    "entity_type",
                    options.entityType
                );

        }



        if (options?.entityId) {

            query =
                query.eq(
                    "entity_id",
                    options.entityId
                );

        }



        if (options?.limit) {

            query =
                query.limit(
                    options.limit
                );

        }



        const {
            data,
            error,
        } = await query;



        if (error) {

            throw error;

        }



        return (data ?? []).map(
            (row) => ({

                id:
                    row.id,


                organizationId:
                    row.organization_id,


                createdAt:
                    row.created_at,


                updatedAt:
                    row.updated_at,


                entityType:
                    row.entity_type,


                metadata:
                    row.metadata,


                userId:
                    row.actor_id,


                actorId:
                    row.actor_id,


                actorType:
                    row.actor_type,


                module:
                    row.source_module ?? "",


                sourceModule:
                    row.source_module,


                eventType:
                    row.event_type,


                eventCategory:
                    row.event_category,


                entity:
                    row.entity_type ?? "",


                entityId:
                    row.entity_id,


                action:
                    row.action,


                actionType:
                    row.event_type,


                description:
                    row.description,


                severity:
                    normalizeSeverity(
                        row.severity
                    ),


                ipAddress:
                    row.ip_address,


                userAgent:
                    row.user_agent,


                beforeData:
                    row.old_values,


                afterData:
                    row.new_values,


                requestId:
                    row.request_id,


                sessionId:
                    row.session_id,


            })
        ) as AuditRecord[];

    }

}



function normalizeSeverity(
    value: string
): "Info" | "Warning" | "Error" | "Critical" {


    switch(value?.toUpperCase()) {


        case "WARNING":
            return "Warning";


        case "ERROR":
            return "Error";


        case "CRITICAL":
            return "Critical";


        default:
            return "Info";

    }

}