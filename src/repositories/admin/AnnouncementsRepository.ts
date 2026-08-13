import type {
    SupabaseClient,
} from "@supabase/supabase-js";

import {
    BaseRepository,
} from "@/lib/db/base-repository";

import type {
    Announcement,
} from "@/types/admin/Announcement";


type AnnouncementRow = {

    id: string;

    organization_id: string;

    title: string;

    content: string;

    status:
        Announcement["status"] |
        null;

    priority:
        Announcement["priority"] |
        null;

    publish_date: string | null;

    expiry_date: string | null;

    created_by: string | null;

    metadata:
        Record<string, unknown> |
        null;

    created_at: string;

    updated_at: string;

};


export interface IAnnouncementsRepository {

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
    extends BaseRepository<Announcement>
    implements IAnnouncementsRepository
{

    constructor(
        supabase: SupabaseClient,
    ) {

        super(
            supabase,
            "announcements",
        );

    }


    async findAll():

    Promise<Announcement[]> {

        const {
            data,
            error,
        } = await this

            .tableRef()

            .select("*")

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
                this.mapAnnouncement(
                    row as AnnouncementRow,
                ),
        );

    }


    async findPublished():

    Promise<Announcement[]> {

        const {
            data,
            error,
        } = await this

            .tableRef()

            .select("*")

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
            row =>
                this.mapAnnouncement(
                    row as AnnouncementRow,
                ),
        );

    }


    async findById(

        id: string,

    ):

    Promise<Announcement | null> {

        const normalizedId =
            this.requireId(
                id,
            );


        const {
            data,
            error,
        } = await this

            .tableRef()

            .select("*")

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

        announcement:
            Partial<Announcement>,

    ):

    Promise<Announcement> {

        if (!announcement) {

            throw new Error(
                "Announcement is required.",
            );

        }


        const title =
            this.requireTitle(
                announcement.title,
            );


        const content =
            this.normalizeString(
                announcement.content,
            );


        const now =
            new Date().toISOString();


        const payload: Record<
            string,
            unknown
        > = {

            organization_id:
                this.organizationId,

            title,

            content,

            status:
                announcement.status ??
                "DRAFT",

            priority:
                announcement.priority ??
                "NORMAL",

            publish_date:
                announcement.publishDate ??
                null,

            expiry_date:
                announcement.expiryDate ??
                null,

            created_by:
                announcement.createdBy ??
                null,

            metadata:
                announcement.metadata ??
                {},

            updated_at:
                now,

        };


        if (announcement.id) {

            payload.id =
                this.requireId(
                    announcement.id,
                );


            if (announcement.createdAt) {

                payload.created_at =
                    announcement.createdAt;

            }

        } else {

            payload.created_at =
                now;

        }


        const {
            data,
            error,
        } = await this

            .tableRef()

            .upsert(
                payload,
                {
                    onConflict:
                        "id",
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

    ):

    Promise<void> {

        await super.delete(
            this.requireId(
                id,
            ),
        );

    }


    private requireId(

        id: string,

    ): string {

        const normalized =
            typeof id === "string"
                ? id.trim()
                : "";


        if (!normalized) {

            throw new Error(
                "Announcement id is required.",
            );

        }


        return normalized;

    }


    private requireTitle(

        title: string | undefined,

    ): string {

        const normalized =
            typeof title === "string"
                ? title.trim()
                : "";


        if (!normalized) {

            throw new Error(
                "Announcement title is required.",
            );

        }


        return normalized;

    }


    private normalizeString(

        value:
            string |
            null |
            undefined,

    ): string {

        if (
            typeof value !==
            "string"
        ) {

            return "";

        }


        return value.trim();

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
                row.status ??
                "DRAFT",

            priority:
                row.priority ??
                "NORMAL",

            publishDate:
                row.publish_date ??
                undefined,

            expiryDate:
                row.expiry_date ??
                undefined,

            createdBy:
                row.created_by ??
                undefined,

            metadata:
                row.metadata ??
                {},

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,

        };

    }

}