import type {
    AuditLog,
} from "@/types/admin/AuditLog";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";

import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";


type AuditLogRow = {

    id: string;

    organization_id: string | null;

    user_id: string | null;

    user_name: string | null;

    action: string;

    entity_type: string;

    entity_id: string | null;

    description: string | null;

    metadata: Record<string, unknown> | null;

    ip_address: string | null;

    user_agent: string | null;

    created_at: string;

};


export class AuditLogsRepository {


    private async client() {

        return createSupabaseServerClient();

    }


    private get organizationId(): string {

        return TenantContextManager
            .require()
            .organizationId;

    }


    async findAll(): Promise<AuditLog[]> {

        const supabase =
            await this.client();

        const {
            data,
            error,
        } = await supabase
            .from("audit_logs")
            .select("*")
            .eq(
                "organization_id",
                this.organizationId,
            )
            .order(
                "created_at",
                {
                    ascending: false,
                },
            );

        if (error) {
            throw error;
        }

        return (data ?? []).map(
            row =>
                this.mapAuditLog(
                    row as AuditLogRow,
                ),
        );
    }


    async findByEntity(
        entityType: string,
        entityId: string,
    ): Promise<AuditLog[]> {

        const normalizedEntityType =
            this.requireValue(
                entityType,
                "Audit entity type",
            );

        const normalizedEntityId =
            this.requireValue(
                entityId,
                "Audit entity id",
            );

        const supabase =
            await this.client();

        const {
            data,
            error,
        } = await supabase
            .from("audit_logs")
            .select("*")
            .eq(
                "organization_id",
                this.organizationId,
            )
            .eq(
                "entity_type",
                normalizedEntityType,
            )
            .eq(
                "entity_id",
                normalizedEntityId,
            )
            .order(
                "created_at",
                {
                    ascending: false,
                },
            );

        if (error) {
            throw error;
        }

        return (data ?? []).map(
            row =>
                this.mapAuditLog(
                    row as AuditLogRow,
                ),
        );
    }


    async findById(
        id: string,
    ): Promise<AuditLog | null> {

        const normalizedId =
            this.requireValue(
                id,
                "Audit log id",
            );

        const supabase =
            await this.client();

        const {
            data,
            error,
        } = await supabase
            .from("audit_logs")
            .select("*")
            .eq(
                "organization_id",
                this.organizationId,
            )
            .eq(
                "id",
                normalizedId,
            )
            .maybeSingle();

        if (error) {
            throw error;
        }

        return data
            ? this.mapAuditLog(
                data as AuditLogRow,
            )
            : null;
    }


    private requireValue(
        value: string,
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


    private mapAuditLog(
        row: AuditLogRow,
    ): AuditLog {

        return {

            id:
                row.id,

            organizationId:
                row.organization_id ?? "",

            userId:
                row.user_id ?? undefined,

            userName:
                row.user_name ?? undefined,

            action:
                row.action as AuditLog["action"],

            entityType:
                row.entity_type,

            entityId:
                row.entity_id ?? "",

            description:
                row.description ?? undefined,

            metadata:
                row.metadata ?? {},

            ipAddress:
                row.ip_address ?? undefined,

            userAgent:
                row.user_agent ?? undefined,

            createdAt:
                row.created_at,

        };
    }

}