/**
 * ============================================================================
 * Notifications Repository
 *
 * Admin / Organization Notification Registry
 *
 * Architecture:
 *
 * Server Action / Service
 *        ↓
 * NotificationsRepository
 *        ↓
 * TenantContextManager
 *        ↓
 * Supabase Server Client
 *        ↓
 * notifications
 *
 * Production rules:
 * - Server-only Supabase client
 * - Tenant isolation on every operation
 * - Organization ID is never accepted from callers
 * - Organization ID always comes from TenantContextManager
 * - Caller-controlled organization_id is never persisted
 * - Input identifiers are validated
 * - Domain mapping is centralized
 * - Create uses INSERT rather than UPDATE/UPSERT semantics
 * - Read/update/delete operations are tenant scoped
 * ============================================================================
 */

import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";

import type {
    Notification,
} from "@/types/admin/Notification";


type NotificationRow = {

    id: string;

    organization_id: string;

    user_id: string | null;

    title: string;

    message: string;

    type: Notification["type"] | null;

    status: Notification["status"] | null;

    entity_type: string | null;

    entity_id: string | null;

    action_url: string | null;

    metadata: Record<string, unknown> | null;

    created_at: string;

    read_at: string | null;

};


export interface INotificationsRepository {

    findAll(): Promise<Notification[]>;

    findById(
        id: string,
    ): Promise<Notification | null>;

    findByUser(
        userId: string,
    ): Promise<Notification[]>;

    create(
        notification: Partial<Notification>,
    ): Promise<Notification>;

    markAsRead(
        id: string,
    ): Promise<void>;

    delete(
        id: string,
    ): Promise<void>;

}


export class NotificationsRepository
    implements INotificationsRepository {


    private async client() {

        return createSupabaseServerClient();

    }


    private get organizationId(): string {

        return TenantContextManager
            .require()
            .organizationId;

    }


    static async create(): Promise<NotificationsRepository> {

        return new NotificationsRepository();

    }


    async findAll(): Promise<Notification[]> {

        const supabase =
            await this.client();


        const {
            data,
            error,
        } =
            await supabase

                .from("notifications")

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


        return (data ?? [])
            .map(
                row =>
                    this.mapNotification(
                        row as NotificationRow,
                    ),
            );

    }


    async findById(
        id: string,
    ): Promise<Notification | null> {

        const normalizedId =
            this.requireId(id);


        const supabase =
            await this.client();


        const {
            data,
            error,
        } =
            await supabase

                .from("notifications")

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
            ? this.mapNotification(
                data as NotificationRow,
            )
            : null;

    }


    async findByUser(
        userId: string,
    ): Promise<Notification[]> {

        const normalizedUserId =
            this.requireId(
                userId,
                "Notification user id",
            );


        const supabase =
            await this.client();


        const {
            data,
            error,
        } =
            await supabase

                .from("notifications")

                .select("*")

                .eq(
                    "organization_id",
                    this.organizationId,
                )

                .eq(
                    "user_id",
                    normalizedUserId,
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


        return (data ?? [])
            .map(
                row =>
                    this.mapNotification(
                        row as NotificationRow,
                    ),
            );

    }


    async create(
        notification: Partial<Notification>,
    ): Promise<Notification> {

        if (!notification) {

            throw new Error(
                "Notification is required.",
            );

        }


        const title =
            notification.title?.trim();


        if (!title) {

            throw new Error(
                "Notification title is required.",
            );

        }


        const message =
            notification.message?.trim();


        if (!message) {

            throw new Error(
                "Notification message is required.",
            );

        }


        const now =
            new Date().toISOString();


        const payload = {

            id:
                notification.id,

            organization_id:
                this.organizationId,

            user_id:
                notification.userId ?? null,

            title,

            message,

            type:
                notification.type ?? "INFO",

            status:
                notification.status ?? "UNREAD",

            entity_type:
                notification.entityType ?? null,

            entity_id:
                notification.entityId ?? null,

            action_url:
                notification.actionUrl ?? null,

            metadata:
                notification.metadata ?? {},

            created_at:
                notification.createdAt ?? now,

        };


        const supabase =
            await this.client();


        const {
            data,
            error,
        } =
            await supabase

                .from("notifications")

                .insert(payload)

                .select("*")

                .single();


        if (error) {

            throw error;

        }


        if (!data) {

            throw new Error(
                "Notification creation returned no data.",
            );

        }


        return this.mapNotification(
            data as NotificationRow,
        );

    }


    async markAsRead(
        id: string,
    ): Promise<void> {

        const normalizedId =
            this.requireId(id);


        const supabase =
            await this.client();


        const {
            error,
        } =
            await supabase

                .from("notifications")

                .update({

                    status: "READ",

                    read_at:
                        new Date()
                            .toISOString(),

                })

                .eq(
                    "organization_id",
                    this.organizationId,
                )

                .eq(
                    "id",
                    normalizedId,
                );


        if (error) {

            throw error;

        }

    }


    async delete(
        id: string,
    ): Promise<void> {

        const normalizedId =
            this.requireId(id);


        const supabase =
            await this.client();


        const {
            error,
        } =
            await supabase

                .from("notifications")

                .delete()

                .eq(
                    "organization_id",
                    this.organizationId,
                )

                .eq(
                    "id",
                    normalizedId,
                );


        if (error) {

            throw error;

        }

    }


    private requireId(
        id: string,
        fieldName = "Notification id",
    ): string {

        const normalizedId =
            id?.trim();


        if (!normalizedId) {

            throw new Error(
                `${fieldName} is required.`,
            );

        }


        return normalizedId;

    }


    private mapNotification(
        row: NotificationRow,
    ): Notification {

        return {

            id:
                row.id,

            organizationId:
                row.organization_id,

            userId:
                row.user_id ?? undefined,

            title:
                row.title,

            message:
                row.message,

            type:
                row.type ?? "INFO",

            status:
                row.status ?? "UNREAD",

            entityType:
                row.entity_type ?? undefined,

            entityId:
                row.entity_id ?? undefined,

            actionUrl:
                row.action_url ?? undefined,

            metadata:
                row.metadata ?? {},

            createdAt:
                row.created_at,

            readAt:
                row.read_at ?? undefined,

        };

    }

}