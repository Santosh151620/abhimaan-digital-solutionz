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









export async function createUser(

    data:AdminUser,

) {



    const service =

        await getService();







    const now =

        new Date()

        .toISOString();







    const user:AdminUser = {



        ...data,



        id:

            data.id ??

            crypto.randomUUID(),





        createdAt:

            data.createdAt ??

            now,





        updatedAt:

            now,





        isActive:

            data.status === "Active",



    };







    await service.save(

        user,

    );







    return {



        success:true,

        id:user.id,



    };



}









export async function updateUser(

    user:AdminUser,

) {



    const service =

        await getService();







    await service.save(

        {

            ...user,

            updatedAt:

                new Date()

                .toISOString(),

            isActive:

                user.status === "Active",

        },

    );







    return {



        success:true,



    };



}









export async function deleteUser(

    id:string,

) {



    const service =

        await getService();







    await service.delete(

        id,

    );







    return {



        success:true,



    };



}