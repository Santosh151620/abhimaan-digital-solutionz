import type {
    SupabaseClient,
} from "@supabase/supabase-js";


import {
    BaseRepository,
} from "@/lib/db/base-repository";


import type {
    AdminUser,
} from "@/types/admin/User";



/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 *
 * Users Repository
 *
 * Persistence layer for organization-scoped administrative users.
 *
 * Responsibilities:
 *
 * - Organization-scoped user reads
 * - User creation/upsert
 * - User updates
 * - User deletion
 * - Database/domain mapping
 *
 * Security boundary:
 *
 * - organization_id is always obtained from BaseRepository.
 * - Callers cannot supply or change organization_id.
 * - All direct reads and updates are explicitly organization-scoped.
 * - Raw database rows never escape the repository.
 *
 * This repository does NOT manage:
 *
 * - Authentication credentials
 * - Passwords
 * - User preferences
 * - Theme state
 * - Organization membership policy
 *
 * ============================================================================
 */



/**
 * ============================================================================
 * Database Row Contract
 * ============================================================================
 */
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



/**
 * ============================================================================
 * Repository Contract
 * ============================================================================
 */
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


    update(
        id:string,
        user:Partial<AdminUser>,
    ):
        Promise<AdminUser>;


    delete(
        id:string,
    ):
        Promise<void>;

}



/**
 * ============================================================================
 * Users Repository
 * ============================================================================
 */
export class UsersRepository

    extends BaseRepository<AdminUser>

    implements IUsersRepository {


    constructor(
        supabase:SupabaseClient,
    ) {

        super(
            supabase,
            "users",
        );

    }



    /**
     * =========================================================================
     * List Users
     * =========================================================================
     */
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


        if (error) {
            throw error;
        }


        return (data ?? [])
            .map(
                row =>
                    this.mapUser(
                        row as UserRow,
                    ),
            );

    }



    /**
     * =========================================================================
     * Active Users
     * =========================================================================
     */
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


        if (error) {
            throw error;
        }


        return (data ?? [])
            .map(
                row =>
                    this.mapUser(
                        row as UserRow,
                    ),
            );

    }



    /**
     * =========================================================================
     * Find By ID
     * =========================================================================
     */
    async findById(

        id:string,

    ):

    Promise<AdminUser | null> {

        const normalizedId =
            this.requireId(
                id,
            );


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
                    normalizedId,
                )
                .maybeSingle();


        if (error) {
            throw error;
        }


        return data
            ? this.mapUser(
                data as UserRow,
            )
            : null;

    }



    /**
     * =========================================================================
     * Find By Email
     * =========================================================================
     */
    async findByEmail(

        email:string,

    ):

    Promise<AdminUser | null> {

        const normalizedEmail =
            this.normalizeEmail(
                email,
            );


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


        if (error) {
            throw error;
        }


        return data
            ? this.mapUser(
                data as UserRow,
            )
            : null;

    }



    /**
     * =========================================================================
     * Save / Upsert
     * =========================================================================
     *
     * Used for create/upsert operations.
     *
     * organization_id is always taken from the repository tenant context.
     * A caller-provided organizationId is never persisted.
     *
     * =========================================================================
     */
    async save(

        user:Partial<AdminUser>,

    ):

    Promise<AdminUser> {

        if (!user) {
            throw new Error(
                "User is required.",
            );
        }


        const now =
            new Date()
                .toISOString();


        const email =
            user.email !== undefined
                ? this.normalizeEmail(
                    user.email,
                )
                : undefined;


        if (!email) {
            throw new Error(
                "Email is required.",
            );
        }


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

                        email,

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
                .select("*")
                .single();


        if (error) {
            throw error;
        }


        return this.mapUser(
            data as UserRow,
        );

    }



    /**
     * =========================================================================
     * Update
     * =========================================================================
     *
     * Updates mutable administrative profile fields only.
     *
     * Deliberately excluded:
     *
     * - organization_id
     * - id
     * - auth_user_id
     * - profile_id
     * - created_at
     * - created_by
     * - password_changed_at
     * - failed_login_attempts
     * - locked_until
     * - last_login_at
     *
     * Authentication/security lifecycle fields must be changed by their
     * dedicated application services.
     *
     * =========================================================================
     */
    async update(

        id:string,

        user:Partial<AdminUser>,

    ):

    Promise<AdminUser> {

        const normalizedId =
            this.requireId(
                id,
            );


        if (!user) {
            throw new Error(
                "User update payload is required.",
            );
        }


        const updatePayload =
            this.mapUpdateUser(
                user,
            );


        if (
            Object.keys(
                updatePayload,
            ).length === 0
        ) {
            throw new Error(
                "No mutable user fields were provided for update.",
            );
        }


        const {
            data,
            error,
        } =
            await this
                .tableRef()
                .update(

                    {

                        ...updatePayload,

                        updated_at:
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
                    normalizedId,
                )
                .select("*")
                .maybeSingle();


        if (error) {
            throw error;
        }


        if (!data) {
            throw new Error(
                "User not found.",
            );
        }


        return this.mapUser(
            data as UserRow,
        );

    }



    /**
     * =========================================================================
     * Delete
     * =========================================================================
     *
     * BaseRepository owns the standard tenant-scoped delete behavior.
     * Application-level protection for system users remains in UsersService.
     *
     * =========================================================================
     */
    async delete(

        id:string,

    ):

    Promise<void> {

        const normalizedId =
            this.requireId(
                id,
            );


        await super.delete(
            normalizedId,
        );

    }



    /**
     * =========================================================================
     * Update Mapping
     * =========================================================================
     *
     * Converts only supported mutable AdminUser fields into database columns.
     *
     * Undefined values are omitted so partial updates do not accidentally
     * erase existing values.
     *
     * =========================================================================
     */
    private mapUpdateUser(

        user:Partial<AdminUser>,

    ):

    Record<string,unknown> {

        const payload:
            Record<string,unknown> =
            {};


        if (
            user.fullName !== undefined
        ) {

            payload.full_name =
                user.fullName.trim();

        }


        if (
            user.firstName !== undefined
        ) {

            payload.first_name =
                user.firstName;

        }


        if (
            user.lastName !== undefined
        ) {

            payload.last_name =
                user.lastName;

        }


        if (
            user.displayName !== undefined
        ) {

            payload.display_name =
                user.displayName;

        }


        if (
            user.email !== undefined
        ) {

            payload.email =
                this.normalizeEmail(
                    user.email,
                );

        }


        if (
            user.phone !== undefined
        ) {

            payload.phone =
                user.phone;

        }


        if (
            user.avatarUrl !== undefined
        ) {

            payload.avatar_url =
                user.avatarUrl;

        }


        if (
            user.jobTitle !== undefined
        ) {

            payload.job_title =
                user.jobTitle;

        }


        if (
            user.department !== undefined
        ) {

            payload.department =
                user.department;

        }


        if (
            user.employeeCode !== undefined
        ) {

            payload.employee_code =
                user.employeeCode;

        }


        if (
            user.userType !== undefined
        ) {

            payload.user_type =
                user.userType;

        }


        if (
            user.status !== undefined
        ) {

            payload.status =
                user.status;

        }


        if (
            user.roleIds !== undefined
        ) {

            payload.role_ids =
                user.roleIds;

        }


        if (
            user.primaryRoleId !== undefined
        ) {

            payload.primary_role_id =
                user.primaryRoleId;

        }


        if (
            user.isActive !== undefined
        ) {

            payload.is_active =
                user.isActive;

        }


        if (
            user.emailVerified !== undefined
        ) {

            payload.email_verified =
                user.emailVerified;

        }


        if (
            user.phoneVerified !== undefined
        ) {

            payload.phone_verified =
                user.phoneVerified;

        }


        if (
            user.locale !== undefined
        ) {

            payload.locale =
                user.locale;

        }


        if (
            user.timezone !== undefined
        ) {

            payload.timezone =
                user.timezone;

        }


        if (
            user.metadata !== undefined
        ) {

            payload.metadata =
                user.metadata;

        }


        if (
            user.updatedBy !== undefined
        ) {

            payload.updated_by =
                user.updatedBy;

        }


        return payload;

    }



    /**
     * =========================================================================
     * Database -> Domain Mapping
     * =========================================================================
     *
     * Raw Supabase rows never escape this repository.
     *
     * =========================================================================
     */
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
                row.profile_id
                ??
                undefined,

            authUserId:
                row.auth_user_id
                ??
                undefined,

            fullName:
                row.full_name,

            firstName:
                row.first_name
                ??
                undefined,

            lastName:
                row.last_name
                ??
                undefined,

            displayName:
                row.display_name
                ??
                undefined,

            email:
                row.email,

            phone:
                row.phone
                ??
                undefined,

            avatarUrl:
                row.avatar_url
                ??
                undefined,

            jobTitle:
                row.job_title
                ??
                undefined,

            department:
                row.department
                ??
                undefined,

            employeeCode:
                row.employee_code
                ??
                undefined,

            userType:
                row.user_type as AdminUser["userType"],

            status:
                row.status as AdminUser["status"],

            roleIds:
                row.role_ids
                ??
                [],

            primaryRoleId:
                row.primary_role_id
                ??
                undefined,

            isActive:
                row.is_active
                ??
                false,

            emailVerified:
                row.email_verified
                ??
                false,

            phoneVerified:
                row.phone_verified
                ??
                false,

            lastLoginAt:
                row.last_login_at
                ??
                undefined,

            lastActivityAt:
                row.last_activity_at
                ??
                undefined,

            passwordChangedAt:
                row.password_changed_at
                ??
                undefined,

            failedLoginAttempts:
                row.failed_login_attempts
                ??
                0,

            lockedUntil:
                row.locked_until
                ??
                undefined,

            locale:
                row.locale
                ??
                undefined,

            timezone:
                row.timezone
                ??
                undefined,

            metadata:
                row.metadata
                ??
                {},

            createdBy:
                row.created_by
                ??
                undefined,

            updatedBy:
                row.updated_by
                ??
                undefined,

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,

        };

    }



    /**
     * =========================================================================
     * Identifier Validation
     * =========================================================================
     */
    private requireId(

        id:string,

    ):string {

        const normalized =
            id?.trim();


        if (!normalized) {
            throw new Error(
                "User id is required.",
            );
        }


        return normalized;

    }



    /**
     * =========================================================================
     * Email Normalization
     * =========================================================================
     */
    private normalizeEmail(

        email:string,

    ):string {

        const normalized =
            email
                ?.trim()
                .toLowerCase();


        if (!normalized) {
            throw new Error(
                "Email is required.",
            );
        }


        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailRegex.test(
                normalized,
            )
        ) {
            throw new Error(
                "Invalid email address.",
            );
        }


        return normalized;

    }


}
