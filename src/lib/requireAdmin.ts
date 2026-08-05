import {
    redirect,
} from "next/navigation";


import {
    createClient,
} from "@/lib/supabase/server";


import {
    getCurrentUser,
} from "@/lib/auth/user";


import type {
    Role,
} from "@/types/auth/role";


import {
    ROLE_HIERARCHY,
} from "@/lib/auth/role-hierarchy";



export async function requireAdmin(

    minimumRole: Role = "ORGANIZATION_ADMIN",

) {


    const supabase =
        await createClient();



    const user =
        await getCurrentUser();



    if (!user) {

        redirect("/login");

    }



    const userRole =
    user.organization.role as Role;


    const userLevel =
        ROLE_HIERARCHY[userRole] ?? 0;



    const requiredLevel =
        ROLE_HIERARCHY[minimumRole] ?? 0;



    if (

        userLevel < requiredLevel

    ) {

        redirect("/unauthorized");

    }



    return {

        user,

        supabase,

    };

}