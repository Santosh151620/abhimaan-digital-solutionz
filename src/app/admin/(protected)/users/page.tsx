import {
    getUsers,
} from "./page-actions";


import UsersClient
from "@/components/admin/users/UsersClient";


import type {
    AdminUser,
} from "@/types/admin/User";


import {
    createClient,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";


async function getOrganizationId() {

    const supabase =
        await createClient();


    const {
        data: {
            user,
        },
    } =
        await supabase.auth.getUser();



    if (!user) {

        return undefined;

    }



    const {
        data: profile,
    } =
        await supabase

            .from("profiles")

            .select(
                "organization_id",
            )

            .eq(
                "id",
                user.id,
            )

            .single();



    return (
        profile?.organization_id
        ??
        undefined
    );

}



export default async function UsersPage() {


    const users: AdminUser[] =
        await getUsers();



    const organizationId =
        await getOrganizationId();



    return (

        <div

            className="
                space-y-6
            "

        >

            <div>


                <h1

                    className="
                        text-2xl
                        font-semibold
                    "

                >

                    Users

                </h1>



                <p

                    className="
                        text-sm
                        text-muted-foreground
                    "

                >

                    Manage organization users and access.

                </p>


            </div>




            <UsersClient

                initialUsers={
                    users
                }

                organizationId={
                    organizationId
                }

            />


        </div>

    );

}