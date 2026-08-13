"use server";


import {
    revalidatePath,
} from "next/cache";


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

    data:Partial<AdminUser>,

) {


    const service =
        await getService();


    const now =
        new Date()
            .toISOString();



    const user:AdminUser = {


        id:
            data.id
            ??
            crypto.randomUUID(),



        organizationId:
            "",



        profileId:
            data.profileId,



        authUserId:
            data.authUserId,



        fullName:
            data.fullName
            ??
            "",



        firstName:
            data.firstName,



        lastName:
            data.lastName,



        displayName:
            data.displayName,



        email:
            data.email
            ??
            "",



        phone:
            data.phone,



        avatarUrl:
            data.avatarUrl,



        jobTitle:
            data.jobTitle,



        department:
            data.department,



        employeeCode:
            data.employeeCode,



        userType:
            data.userType
            ??
            "Internal",



        status:
            data.status
            ??
            "Pending",



        roleIds:
            data.roleIds
            ??
            [],



        primaryRoleId:
            data.primaryRoleId,



        isActive:
            data.status === "Active",



        emailVerified:
            data.emailVerified
            ??
            false,



        phoneVerified:
            data.phoneVerified
            ??
            false,



        locale:
            data.locale,



        timezone:
            data.timezone,



        metadata:
            data.metadata
            ??
            {},



        createdBy:
            data.createdBy,



        updatedBy:
            data.updatedBy,



        createdAt:
            data.createdAt
            ??
            now,



        updatedAt:
            now,


    };



    const saved =
        await service.save(
            user,
        );



    revalidatePath(
        "/admin/users",
    );



    return {

        success:true,

        id:saved.id,

    };

}









export async function updateUser(

    data:Partial<AdminUser>,

) {


    if (!data.id) {

        throw new Error(
            "User id is required.",
        );

    }



    const service =
        await getService();



    await service.update(

        data.id,

        data,

    );



    revalidatePath(
        "/admin/users",
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



    revalidatePath(
        "/admin/users",
    );



    return {

        success:true,

    };

}