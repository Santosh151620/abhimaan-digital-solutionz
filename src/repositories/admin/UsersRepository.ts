import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    BaseRepository,
} from "@/lib/db/base-repository";


import type {
    AdminUser,
} from "@/types/admin/User";




type UserRow = {

    id:string;

    organization_id:string;

    profile_id:string | null;

    auth_user_id:string | null;

    full_name:string;

    first_name:string | null;

    last_name:string | null;

    display_name:string | null;

    email:string;

    phone:string | null;

    avatar_url:string | null;

    job_title:string | null;

    department:string | null;

    employee_code:string | null;

    user_type:string;

    status:string;

    role_ids:string[] | null;

    primary_role_id:string | null;

    is_active:boolean | null;

    email_verified:boolean | null;

    phone_verified:boolean | null;

    last_login_at:string | null;

    last_activity_at:string | null;

    password_changed_at:string | null;

    failed_login_attempts:number | null;

    locked_until:string | null;

    locale:string | null;

    timezone:string | null;

    metadata:Record<string,unknown> | null;

    created_by:string | null;

    updated_by:string | null;

    created_at:string;

    updated_at:string;

};





export interface IUsersRepository {


    list():
        Promise<AdminUser[]>;



    active():
        Promise<AdminUser[]>;



    findById(
        id:string,
    ):
        Promise<AdminUser | null>;



    findByEmail(
        email:string,
    ):
        Promise<AdminUser | null>;



    save(
        user:Partial<AdminUser>,
    ):
        Promise<AdminUser>;



    delete(
        id:string,
    ):
        Promise<void>;


}







export class UsersRepository

    extends BaseRepository<AdminUser>

    implements IUsersRepository {


    constructor(
        supabase:SupabaseClient,
    ){

        super(
            supabase,
            "users",
        );

    }







    async list():

        Promise<AdminUser[]> {


        const {
            data,
            error,

        } =
            await this

                .tableRef()

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
                    this.mapUser(
                        row as UserRow,
                    ),
            );

    }








    async active():

        Promise<AdminUser[]> {


        const {
            data,
            error,

        } =
            await this

                .tableRef()

                .select("*")

                .eq(
                    "organization_id",
                    this.organizationId,
                )

                .eq(
                    "is_active",
                    true,
                )

                .order(
                    "full_name",
                    {
                        ascending:true,
                    },
                );



        if(error)
            throw error;



        return (data ?? [])
            .map(
                row =>
                    this.mapUser(
                        row as UserRow,
                    ),
            );

    }








    async findById(
        id:string,
    ):
        Promise<AdminUser | null>{


        const {
            data,
            error,

        } =
            await this

                .tableRef()

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
            ? this.mapUser(
                data as UserRow,
            )
            : null;

    }









    async findByEmail(
        email:string,
    ):
        Promise<AdminUser | null>{


        const normalizedEmail =
            email
                .trim()
                .toLowerCase();



        const {
            data,
            error,

        } =
            await this

                .tableRef()

                .select("*")

                .eq(
                    "organization_id",
                    this.organizationId,
                )

                .eq(
                    "email",
                    normalizedEmail,
                )

                .maybeSingle();



        if(error)
            throw error;



        return data
            ? this.mapUser(
                data as UserRow,
            )
            : null;

    }









    async save(
        user:Partial<AdminUser>,
    ):
        Promise<AdminUser>{


        const now =
            new Date()
                .toISOString();



        const {
            data,
            error,

        } =
            await this

                .tableRef()

                .upsert(

                    {


                        id:
                            user.id,



                        organization_id:
                            this.organizationId,



                        profile_id:
                            user.profileId ?? null,



                        auth_user_id:
                            user.authUserId ?? null,



                        full_name:
                            user.fullName
                                ?.trim()
                            ??
                            "",



                        first_name:
                            user.firstName ?? null,



                        last_name:
                            user.lastName ?? null,



                        display_name:
                            user.displayName ?? null,



                        email:
                            user.email
                                ?.trim()
                                .toLowerCase(),



                        phone:
                            user.phone ?? null,



                        avatar_url:
                            user.avatarUrl ?? null,



                        job_title:
                            user.jobTitle ?? null,



                        department:
                            user.department ?? null,



                        employee_code:
                            user.employeeCode ?? null,



                        user_type:
                            user.userType ?? "User",



                        status:
                            user.status ?? "Active",



                        role_ids:
                            user.roleIds ?? [],



                        primary_role_id:
                            user.primaryRoleId ?? null,



                        is_active:
                            user.isActive ?? true,



                        email_verified:
                            user.emailVerified ?? false,



                        phone_verified:
                            user.phoneVerified ?? false,



                        last_login_at:
                            user.lastLoginAt ?? null,



                        last_activity_at:
                            user.lastActivityAt ?? null,



                        password_changed_at:
                            user.passwordChangedAt ?? null,



                        failed_login_attempts:
                            user.failedLoginAttempts ?? 0,



                        locked_until:
                            user.lockedUntil ?? null,



                        locale:
                            user.locale ?? null,



                        timezone:
                            user.timezone ?? null,



                        metadata:
                            user.metadata ?? {},



                        created_by:
                            user.createdBy ?? null,



                        updated_by:
                            user.updatedBy ?? null,



                        created_at:
                            user.createdAt ?? now,



                        updated_at:
                            now,


                    },

                    {
                        onConflict:"id",
                    },

                )

                .select()

                .single();



        if(error)
            throw error;



        return this.mapUser(
            data as UserRow,
        );

    }








    async delete(
        id:string,
    ):
        Promise<void>{


        await super.delete(
            id,
        );

    }









    private mapUser(
        row:UserRow,
    ):
        AdminUser {


        return {


            id:
                row.id,



            organizationId:
                row.organization_id,



            profileId:
                row.profile_id ?? undefined,



            authUserId:
                row.auth_user_id ?? undefined,



            fullName:
                row.full_name,



            firstName:
                row.first_name ?? undefined,



            lastName:
                row.last_name ?? undefined,



            displayName:
                row.display_name ?? undefined,



            email:
                row.email,



            phone:
                row.phone ?? undefined,



            avatarUrl:
                row.avatar_url ?? undefined,



            jobTitle:
                row.job_title ?? undefined,



            department:
                row.department ?? undefined,



            employeeCode:
                row.employee_code ?? undefined,



            userType:
                row.user_type as AdminUser["userType"],



            status:
                row.status as AdminUser["status"],



            roleIds:
                row.role_ids ?? [],



            primaryRoleId:
                row.primary_role_id ?? undefined,



            isActive:
                row.is_active ?? false,



            emailVerified:
                row.email_verified ?? false,



            phoneVerified:
                row.phone_verified ?? false,



            lastLoginAt:
                row.last_login_at ?? undefined,



            lastActivityAt:
                row.last_activity_at ?? undefined,



            passwordChangedAt:
                row.password_changed_at ?? undefined,



            failedLoginAttempts:
                row.failed_login_attempts ?? 0,



            lockedUntil:
                row.locked_until ?? undefined,



            locale:
                row.locale ?? undefined,



            timezone:
                row.timezone ?? undefined,



            metadata:
                row.metadata ?? {},



            createdBy:
                row.created_by ?? undefined,



            updatedBy:
                row.updated_by ?? undefined,



            createdAt:
                row.created_at,



            updatedAt:
                row.updated_at,


        };

    }


}