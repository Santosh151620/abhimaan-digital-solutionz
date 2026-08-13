"use server";


import {
    createClient,
} from "@/lib/supabase/server";


import {
    UsersRepository,
} from "@/repositories/admin/UsersRepository";


import {
    UsersService,
} from "@/services/admin/UsersService";


import type {
    AdminUser,
} from "@/types/admin/User";






async function getService() {


    const supabase =
        await createClient();



    const repository =
        new UsersRepository(
            supabase,
        );



    return new UsersService(
        repository,
    );

}







export async function getUsers():

Promise<AdminUser[]> {


    try {


        const service =
            await getService();



        const users =
            await service.list();



        return users ?? [];



    }

    catch (error) {


        console.error(
            "Failed to load admin users.",
            error,
        );


        throw new Error(
            "Unable to load users.",
        );


    }


}