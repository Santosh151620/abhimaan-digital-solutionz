import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";


import type {
    Announcement,
} from "@/types/admin/Announcement";


import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";



type AnnouncementRow = {

    id:string;

    organization_id:string;

    title:string;

    content:string;

    status:Announcement["status"] | null;

    priority:Announcement["priority"] | null;

    publish_date:string | null;

    expiry_date:string | null;

    created_by:string | null;

    metadata:Record<string,unknown> | null;

    created_at:string;

    updated_at:string;

};





export class AnnouncementsRepository {



    private async client(){

        return await createSupabaseServerClient();

    }





    private get organizationId():string {

        return TenantContextManager
            .require()
            .organizationId;

    }







    async findAll():

        Promise<Announcement[]> {


        const supabase =
            await this.client();


        const {
            data,
            error,

        } =
            await supabase

                .from("announcements")

                .select("*")

                .eq(
                    "organization_id",
                    this.organizationId,
                )

                .order(
                    "created_at",
                    {
                        ascending:false,
                    },
                );


        if(error)
            throw error;



        return (data ?? [])
            .map(
                row =>
                    this.mapAnnouncement(
                        row as AnnouncementRow,
                    ),
            );

    }







    async findPublished():

        Promise<Announcement[]> {


        const supabase =
            await this.client();


        const {
            data,
            error,

        } =
            await supabase

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
                        ascending:false,
                    },
                );


        if(error)
            throw error;



        return (data ?? [])
            .map(
                row =>
                    this.mapAnnouncement(
                        row as AnnouncementRow,
                    ),
            );

    }







    async findById(
        id:string,
    ):
        Promise<Announcement | null>{


        const supabase =
            await this.client();


        const {
            data,
            error,

        } =
            await supabase

                .from("announcements")

                .select("*")

                .eq(
                    "organization_id",
                    this.organizationId,
                )

                .eq(
                    "id",
                    id,
                )

                .maybeSingle();



        if(error)
            throw error;



        return data
            ? this.mapAnnouncement(
                data as AnnouncementRow,
            )
            : null;

    }







    async save(
        announcement:Partial<Announcement>,
    ):
        Promise<Announcement>{


        const supabase =
            await this.client();



        if(!announcement.title?.trim()){

            throw new Error(
                "Announcement title is required.",
            );

        }



        const now =
            new Date()
                .toISOString();



        const payload = {


            id:
                announcement.id,


            organization_id:
                this.organizationId,


            title:
                announcement.title.trim(),


            content:
                announcement.content ?? "",


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



        const {
            data,
            error,

        } =
            await supabase

                .from("announcements")

                .upsert(
                    payload,
                    {
                        onConflict:"id",
                    },
                )

                .select()

                .single();



        if(error)
            throw error;



        return this.mapAnnouncement(
            data as AnnouncementRow,
        );

    }







    async delete(
        id:string,
    ):
        Promise<void>{


        const supabase =
            await this.client();



        const {
            error,

        } =
            await supabase

                .from("announcements")

                .delete()

                .eq(
                    "organization_id",
                    this.organizationId,
                )

                .eq(
                    "id",
                    id,
                );



        if(error)
            throw error;

    }







    private mapAnnouncement(
        row:AnnouncementRow,
    ):
        Announcement {


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
                row.publish_date,


            expiryDate:
                row.expiry_date,


            createdBy:
                row.created_by,


            metadata:
                row.metadata ?? {},


            createdAt:
                row.created_at,


            updatedAt:
                row.updated_at,

        };

    }


}