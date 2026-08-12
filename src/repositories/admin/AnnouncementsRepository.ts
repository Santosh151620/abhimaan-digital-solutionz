/**
 * ============================================================================
 * Announcements Repository
 *
 * Admin Announcement Registry
 *
 * Architecture:
 *
 * Server Action / Service
 *        ↓
 * AnnouncementsRepository
 *        ↓
 * TenantContextManager
 *        ↓
 * Supabase Server Client
 *        ↓
 * announcements
 *
 * Production rules:
 * - Server-only Supabase client
 * - Tenant isolation on every operation
 * - No caller-supplied organization_id
 * - Organization ID always comes from TenantContextManager
 * - Strong input validation
 * - Stable domain mapping
 * ============================================================================
 */

import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";

import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";

import type {
    Announcement,
} from "@/types/admin/Announcement";


type AnnouncementRow = {
    id: string;

    organization_id: string;

    title: string;

    content: string;

    status: Announcement["status"] | null;

    priority: Announcement["priority"] | null;

    publish_date: string | null;

    expiry_date: string | null;

    created_by: string | null;

    metadata: Record<string, unknown> | null;

    created_at: string;

    updated_at: string;
};


interface IAnnouncementsRepository {

    findAll(): Promise<Announcement[]>;

    findPublished(): Promise<Announcement[]>;

    findById(
        id: string,
    ): Promise<Announcement | null>;

    save(
        announcement: Partial<Announcement>,
    ): Promise<Announcement>;

    delete(
        id: string,
    ): Promise<void>;
}


export class AnnouncementsRepository
    implements IAnnouncementsRepository {

    private async client() {
        return createSupabaseServerClient();
    }


    private get organizationId(): string {
        return TenantContextManager
            .require()
            .organizationId;
    }


    static async create(): Promise<AnnouncementsRepository> {
        return new AnnouncementsRepository();
    }


    async findAll(): Promise<Announcement[]> {

        const supabase = await this.client();

        const {
            data,
            error,
        } = await supabase
            .from("announcements")
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
            (row) =>
                this.mapAnnouncement(
                    row as AnnouncementRow,
                ),
        );
    }


    async findPublished(): Promise<Announcement[]> {

        const supabase = await this.client();

        const {
            data,
            error,
        } = await supabase
            .from("announcements")
            .select("*")
            .eq(
                "organization_id",
                this.organizationId,
            )
            .eq(
                "status",
                "PUBLISHED",
            )
            .order(
                "publish_date",
                {
                    ascending: false,
                },
            );

        if (error) {
            throw error;
        }

        return (data ?? []).map(
            (row) =>
                this.mapAnnouncement(
                    row as AnnouncementRow,
                ),
        );
    }


    async findById(
        id: string,
    ): Promise<Announcement | null> {

        const normalizedId =
            this.requireId(id);

        const supabase = await this.client();

        const {
            data,
            error,
        } = await supabase
            .from("announcements")
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
            ? this.mapAnnouncement(
                data as AnnouncementRow,
            )
            : null;
    }


    async save(
        announcement: Partial<Announcement>,
    ): Promise<Announcement> {

        if (!announcement) {
            throw new Error(
                "Announcement is required.",
            );
        }

        const title =
            announcement.title?.trim();

        if (!title) {
            throw new Error(
                "Announcement title is required.",
            );
        }

        const content =
            announcement.content?.trim() ?? "";

        const now =
            new Date().toISOString();

        const payload = {
            id:
                announcement.id,

            organization_id:
                this.organizationId,

            title,

            content,

            status:
                announcement.status ?? "DRAFT",

            priority:
                announcement.priority ?? "NORMAL",

            publish_date:
                announcement.publishDate ?? null,

            expiry_date:
                announcement.expiryDate ?? null,

            created_by:
                announcement.createdBy ?? null,

            metadata:
                announcement.metadata ?? {},

            created_at:
                announcement.createdAt ?? now,

            updated_at:
                now,
        };

        const supabase =
            await this.client();

        const {
            data,
            error,
        } = await supabase
            .from("announcements")
            .upsert(
                payload,
                {
                    onConflict: "id",
                },
            )
            .select("*")
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            throw new Error(
                "Announcement save returned no data.",
            );
        }

        return this.mapAnnouncement(
            data as AnnouncementRow,
        );
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
        } = await supabase
            .from("announcements")
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
    ): string {

        const normalizedId =
            id?.trim();

        if (!normalizedId) {
            throw new Error(
                "Announcement id is required.",
            );
        }

        return normalizedId;
    }


    private mapAnnouncement(
        row: AnnouncementRow,
    ): Announcement {

        return {
            id:
                row.id,

            organizationId:
                row.organization_id,

            title:
                row.title,

            content:
                row.content,

            status:
                row.status ?? "DRAFT",

            priority:
                row.priority ?? "NORMAL",

            publishDate:
                row.publish_date ?? undefined,

            expiryDate:
                row.expiry_date ?? undefined,

            createdBy:
                row.created_by ?? undefined,

            metadata:
                row.metadata ?? {},

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,
        };
    }
}