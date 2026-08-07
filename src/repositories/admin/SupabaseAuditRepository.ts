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
 * Production rules:
 * - Immutable audit records
 * - Organization isolated
 * - No update/delete operations
 * - Tenant scope always comes from TenantContextManager
 * - Strict input validation
 * - Bounded log queries
 * - Stable domain mapping
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


type AuditRow = {
    id: string;

    organization_id: string;

    created_at: string;

    updated_at: string | null;

    actor_id: string | null;

    actor_type: string | null;

    event_type: string | null;

    event_category: string | null;

    entity_type: string | null;

    entity_id: string | null;

    action: string | null;

    description: string | null;

    old_values: Record<string, unknown> | null;

    new_values: Record<string, unknown> | null;

    ip_address: string | null;

    user_agent: string | null;

    source_module: string | null;

    severity: string | null;

    metadata: Record<string, unknown> | null;

    request_id: string | null;

    session_id: string | null;
};


const DEFAULT_LIMIT = 100;

const MAX_LIMIT = 500;


export class SupabaseAuditRepository
    implements IAuditRepository {


    constructor(
        private readonly supabase: SupabaseClient,
    ) {}


    private get organizationId(): string {

        return TenantContextManager
            .require()
            .organizationId;
    }


    async log(
        entry: AuditRecord,
    ): Promise<void> {

        if (!entry) {
            throw new Error(
                "Audit entry is required.",
            );
        }


        const organizationId =
            this.organizationId;


        const eventType =
            this.requiredValue(
                entry.eventType ??
                    entry.actionType,
                "Audit event type",
            );


        const action =
            this.requiredValue(
                entry.action,
                "Audit action",
            );


        const severity =
            this.normalizeSeverityForDatabase(
                entry.severity,
            );


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
                    entry.userId ??
                    null,

                actor_type:
                    entry.actorType ??
                    "USER",

                event_type:
                    eventType,

                event_category:
                    entry.eventCategory ??
                    entry.module ??
                    null,

                entity_type:
                    entry.entityType ??
                    entry.entity ??
                    null,

                entity_id:
                    entry.entityId ??
                    null,

                action,

                description:
                    entry.description ??
                    null,

                old_values:
                    entry.beforeData ??
                    {},

                new_values:
                    entry.afterData ??
                    {},

                ip_address:
                    entry.ipAddress ??
                    null,

                user_agent:
                    entry.userAgent ??
                    null,

                source_module:
                    entry.sourceModule ??
                    entry.module ??
                    null,

                severity,

                metadata:
                    entry.metadata ??
                    {},

                request_id:
                    entry.requestId ??
                    null,

                session_id:
                    entry.sessionId ??
                    null,
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
        },
    ): Promise<AuditRecord[]> {

        const organizationId =
            this.organizationId;


        const limit =
            this.normalizeLimit(
                options?.limit,
            );


        let query =
            this.supabase
                .schema("audit")
                .from("audit_events")
                .select("*")
                .eq(
                    "organization_id",
                    organizationId,
                )
                .order(
                    "created_at",
                    {
                        ascending: false,
                    },
                )
                .limit(limit);


        const entityType =
            options?.entityType?.trim();


        if (entityType) {
            query =
                query.eq(
                    "entity_type",
                    entityType,
                );
        }


        const entityId =
            options?.entityId?.trim();


        if (entityId) {
            query =
                query.eq(
                    "entity_id",
                    entityId,
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
            (row) =>
                this.mapAuditRecord(
                    row as AuditRow,
                ),
        );
    }


    private mapAuditRecord(
        row: AuditRow,
    ): AuditRecord {

        return {
            id:
                row.id,

            organizationId:
                row.organization_id,

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at ??
                row.created_at,

            entityType:
                row.entity_type,

            metadata:
                row.metadata ??
                {},

            userId:
                row.actor_id,

            actorId:
                row.actor_id,

            actorType:
                row.actor_type,

            module:
                row.source_module ??
                "",

            sourceModule:
                row.source_module,

            eventType:
                row.event_type,

            eventCategory:
                row.event_category,

            entity:
                row.entity_type ??
                "",

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
                    row.severity,
                ),

            ipAddress:
                row.ip_address,

            userAgent:
                row.user_agent,

            beforeData:
                row.old_values ??
                {},

            afterData:
                row.new_values ??
                {},

            requestId:
                row.request_id,

            sessionId:
                row.session_id,
        } as AuditRecord;
    }


    private requiredValue(
        value: string | null | undefined,
        fieldName: string,
    ): string {

        const normalized =
            value?.trim();


        if (!normalized) {
            throw new Error(
                `${fieldName} is required.`,
            );
        }


        return normalized;
    }


    private normalizeLimit(
        value: number | undefined,
    ): number {

        if (
            value === undefined ||
            !Number.isFinite(value)
        ) {
            return DEFAULT_LIMIT;
        }


        return Math.min(
            Math.max(
                Math.trunc(value),
                1,
            ),
            MAX_LIMIT,
        );
    }


    private normalizeSeverityForDatabase(
        value: AuditRecord["severity"],
    ): string {

        switch (
            value?.toString().toUpperCase()
        ) {

            case "WARNING":
            case "WARN":
                return "WARNING";

            case "ERROR":
                return "ERROR";

            case "CRITICAL":
                return "CRITICAL";

            case "INFO":
            default:
                return "INFO";
        }
    }
}


function normalizeSeverity(
    value: string | null | undefined,
): "Info" | "Warning" | "Error" | "Critical" {

    switch (
        value?.toUpperCase()
    ) {

        case "WARNING":
        case "WARN":
            return "Warning";

        case "ERROR":
            return "Error";

        case "CRITICAL":
            return "Critical";

        case "INFO":
        default:
            return "Info";
    }
}