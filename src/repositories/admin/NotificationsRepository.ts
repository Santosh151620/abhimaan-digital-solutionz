import {
    TenantContextManager,
} from "@/lib/tenant/tenantContext";


import type {
    Notification,
} from "@/types/admin/Notification";


import {
    createSupabaseServerClient,
} from "@/lib/supabase/server-client";



type NotificationRow = {

    id:string;

    organization_id:string;

    user_id:string | null;

    title:string;

    message:string;

    type:Notification["type"] | null;

    status:Notification["status"] | null;

    entity_type:string | null;

    entity_id:string | null;

    action_url:string | null;

    metadata:Record<string,unknown> | null;

    created_at:string;

    read_at:string | null;

};



export class NotificationsRepository {


    private async client(){

        return await createSupabaseServerClient();

    }



    private get organizationId():string {

        return TenantContextManager
            .require()
            .organizationId;

    }





    async findAll():
        Promise<Notification[]> {


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
                        ascending:false,
                    },
                );



        if(error)
            throw error;



        return (data ?? [])
            .map(
                row =>
                    this.mapNotification(
                        row as NotificationRow,
                    ),
            );

    }





    async findById(
        id:string,
    ):
        Promise<Notification | null>{


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
                    id,
                )

                .maybeSingle();



        if(error)
            throw error;



        return data
            ? this.mapNotification(
                data as NotificationRow,
            )
            : null;

    }






    async findByUser(
        userId:string,
    ):
        Promise<Notification[]> {


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
                    userId,
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
                    this.mapNotification(
                        row as NotificationRow,
                    ),
            );

    }







    async create(
        notification:Partial<Notification>,
    ):
        Promise<Notification>{


        const supabase =
            await this.client();



        if(!notification.title?.trim())
            throw new Error(
                "Notification title is required.",
            );


        if(!notification.message?.trim())
            throw new Error(
                "Notification message is required.",
            );



        const {
            data,
            error,
        } =
            await supabase

                .from("notifications")

                .upsert(
                    {

                        id:
                            notification.id,

                        organization_id:
                            this.organizationId,

                        user_id:
                            notification.userId ?? null,

                        title:
                            notification.title.trim(),

                        message:
                            notification.message.trim(),

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

                    },
                    {
                        onConflict:"id",
                    },
                )

                .select()

                .single();



        if(error)
            throw error;



        return this.mapNotification(
            data as NotificationRow,
        );

    }








    async markAsRead(
        id:string,
    ):
        Promise<void>{


        const supabase =
            await this.client();



        const {
            error,
        } =
            await supabase

                .from("notifications")

                .update(
                    {

                        status:
                            "READ",

                        read_at:
                            new Date()
                                .toISOString(),

                    },
                )

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

                .from("notifications")

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








    private mapNotification(
        row:NotificationRow,
    ):
        Notification {


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