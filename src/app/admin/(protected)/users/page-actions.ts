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



    const service =

        await getService();







    return service.list();



}