"use server";

import { createClient } from "@/lib/supabase/server";

import {
    UsersRepository,
} from "@/repositories/admin/UsersRepository";

import {
    UsersService,
} from "@/services/admin/UsersService";

import type {
    AdminUser,
} from "@/types/admin/User";


async function getService(){

    const supabase =
        await createClient();


    const repository =
        new UsersRepository(
            supabase
        );


    return new UsersService(
        repository
    );

}



export async function createUser(
    data: Partial<AdminUser>
){

    const service =
        await getService();


    const user = {

        id:
            crypto.randomUUID(),

        organizationId:
            data.organizationId ?? "",

        fullName:
            data.fullName ?? "",

        email:
            data.email ?? "",

        userType:
            data.userType ?? "Internal",

        status:
            data.status ?? "Pending",

        roleIds:
            data.roleIds ?? [],

        isActive:
            data.status === "Active",

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString(),

    } as AdminUser;



    await service.save(
        user
    );


    return {
        success:true
    };

}





export async function updateUser(
    data: AdminUser
){

    const service =
        await getService();


    await service.save(
        data
    );


    return {
        success:true
    };

}





export async function deleteUser(
    id:string
){

    const service =
        await getService();


    await service.delete(
        id
    );


    return {
        success:true
    };

}