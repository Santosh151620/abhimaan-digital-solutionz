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
type UserRoleRow = {

    user_id:string;

    organization_id:string;

    role_id:string;

    is_primary:boolean | null;

};


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


        const users =
            (data ?? [])
                .map(
                    row =>
                        this.mapUser(
                            row as UserRow,
                        ),
                );

        return this.hydrateUsers(
            users,
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


        const users =
            (data ?? [])
                .map(
                    row =>
                        this.mapUser(
                            row as UserRow,
                        ),
                );

        return this.hydrateUsers(
            users,
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


        if (!data) {
            return null;
        }


        const users =
            await this.hydrateUsers(
                [
                    this.mapUser(
                        data as UserRow,
                    ),
                ],
            );

        return users[0] ?? null;

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


        if (!data) {
            return null;
        }


        const users =
            await this.hydrateUsers(
                [
                    this.mapUser(
                        data as UserRow,
                    ),
                ],
            );

        return users[0] ?? null;

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
    user.id ??
    crypto.randomUUID(),

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


        const savedUser =
            this.mapUser(
                data as UserRow,
            );

        await this.syncUserRoles(
            savedUser,
            user.roleIds,
            user.primaryRoleId,
            user.createdBy
            ??
            user.updatedBy,
        );

        const hydratedUsers =
            await this.hydrateUsers(
                [savedUser],
            );

        return hydratedUsers[0];

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


        const updatedUser =
            this.mapUser(
                data as UserRow,
            );

        await this.syncUserRoles(
            updatedUser,
            user.roleIds,
            user.primaryRoleId,
            user.updatedBy,
        );

        const hydratedUsers =
            await this.hydrateUsers(
                [updatedUser],
            );

        return hydratedUsers[0];

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

    private async syncUserRoles(
        user:AdminUser,
        roleIds?:string[],
        primaryRoleId?:string,
        actorId?:string,
    ):
        Promise<void> {

        if (
            roleIds === undefined
            &&
            primaryRoleId === undefined
        ) {
            return;
        }

        const normalizedRoleIds =
            Array.from(
                new Set(
                    (roleIds ?? [])
                        .filter(
                            (
                                roleId,
                            ): roleId is string =>
                                Boolean(
                                    roleId,
                                ),
                        ),
                ),
            );

        if (
            primaryRoleId
            &&
            !normalizedRoleIds.includes(
                primaryRoleId,
            )
        ) {
            normalizedRoleIds.push(
                primaryRoleId,
            );
        }

        const {
            error:deleteError,
        } =
            await this
                .supabase
                .from("admin_user_roles")
                .delete()
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "user_id",
                    user.profileId,
                );

        if (deleteError) {
            throw deleteError;
        }

        if (
            normalizedRoleIds.length === 0
        ) {
            return;
        }

        const rows =
            normalizedRoleIds.map(
                roleId => ({
                    organization_id:
                        this.organizationId,

                    user_id:
                        user.profileId,

                    role_id:
                        roleId,

                    is_primary:
                        roleId ===
                        primaryRoleId,

                    created_by:
                        actorId ?? null,

                    updated_by:
                        actorId ?? null,
                }),
            );

        const {
            error,
        } =
            await this
                .supabase
                .from("admin_user_roles")
                .insert(rows);

        if (error) {
            throw error;
        }

    }

    private async hydrateUsers(
        users:AdminUser[],
    ):
        Promise<AdminUser[]> {

        if (
            users.length === 0
        ) {
            return users;
        }

        const profileIds =
            users
                .map(
                    user =>
                        user.profileId,
                )
                .filter(
                    (
                        id,
                    ): id is string =>
                        Boolean(id),
                );

        if (
            profileIds.length === 0
        ) {
            return users;
        }

        const {
            data,
            error,
        } =
            await this
                .supabase
                .from("admin_user_roles")
                .select(
                    "user_id, organization_id, role_id, is_primary",
                )
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .in(
                    "user_id",
                    profileIds,
                );

        if (error) {
            throw error;
        }

        const assignments =
            (data ?? []) as UserRoleRow[];

        const rolesByUser =
            new Map<
                string,
                {
                    roleIds:string[];
                    primaryRoleId:string | undefined;
                }
            >();

        for (
            const assignment
            of assignments
        ) {

            const existing =
                rolesByUser.get(
                    assignment.user_id,
                )
                ??
                {
                    roleIds:[],
                    primaryRoleId:
                        undefined,
                };

            existing.roleIds.push(
                assignment.role_id,
            );

            if (
                assignment.is_primary
            ) {
                existing.primaryRoleId =
                    assignment.role_id;
            }

            rolesByUser.set(
                assignment.user_id,
                existing,
            );
        }

        return users.map(
            user => {

                const profileId =
                    user.profileId;

                if (!profileId) {
                    return user;
                }

                const roles =
                    rolesByUser.get(
                        profileId,
                    );

                return {
                    ...user,
                    roleIds:
                        roles?.roleIds
                        ??
                        [],
                    primaryRoleId:
                        roles?.primaryRoleId,
                };
            },
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
                row.status as AdminUser["status"],            roleIds:
                [],
            primaryRoleId:
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
















