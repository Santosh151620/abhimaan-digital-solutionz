/**
 * ============================================================================
 * ADS User Role Repository
 *
 * Production RBAC Assignment Repository
 *
 * Responsibilities:
 * - Organization-scoped user/role assignments
 * - Active role retrieval
 * - Role assignment and removal
 * - Full role replacement
 * - Primary-role management
 *
 * Security:
 * - organization_id always comes from BaseRepository / TenantContextManager
 * - Caller-supplied organization IDs are never accepted
 * - Every mutation is tenant-scoped
 * - Role/user identifiers are validated
 * - Existing assignments are reused where possible
 * ============================================================================
 */

import type {
    SupabaseClient,
} from "@supabase/supabase-js";

import {
    BaseRepository,
} from "@/lib/db/base-repository";

import type {
    UserRole,
} from "@/types/admin/UserRole";


type UserRoleRow = {

    id: string;

    organization_id: string;

    user_id: string;

    role_id: string;

    is_primary: boolean | null;

    is_active: boolean | null;

    assigned_by: string | null;

    assigned_at: string | null;

    created_at: string;

    updated_at: string;

};


export interface IUserRoleRepository {

    rolesForUser(
        userId: string,
    ): Promise<UserRole[]>;

    assignRole(
        userId: string,
        roleId: string,
    ): Promise<void>;

    removeRole(
        userId: string,
        roleId: string,
    ): Promise<void>;

    replaceRoles(
        userId: string,
        roleIds: string[],
    ): Promise<void>;

    setPrimaryRole(
        userId: string,
        roleId: string,
    ): Promise<void>;

}


export class UserRoleRepository
    extends BaseRepository<UserRole>
    implements IUserRoleRepository {

    constructor(
        supabase: SupabaseClient,
    ) {
        super(
            supabase,
            "user_roles",
        );
    }


    async rolesForUser(
        userId: string,
    ): Promise<UserRole[]> {

        const normalizedUserId =
            this.requireId(
                userId,
                "User id",
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
                    "user_id",
                    normalizedUserId,
                )
                .eq(
                    "is_active",
                    true,
                )
                .order(
                    "created_at",
                    {
                        ascending: true,
                    },
                );

        if (error) {
            throw error;
        }

        return (data ?? [])
            .map(
                row =>
                    this.mapRole(
                        row as UserRoleRow,
                    ),
            );
    }


    async assignRole(
        userId: string,
        roleId: string,
    ): Promise<void> {

        const normalizedUserId =
            this.requireId(
                userId,
                "User id",
            );

        const normalizedRoleId =
            this.requireId(
                roleId,
                "Role id",
            );

        const existing =
            await this
                .tableRef()
                .select("id")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "user_id",
                    normalizedUserId,
                )
                .eq(
                    "role_id",
                    normalizedRoleId,
                )
                .maybeSingle();

        if (existing.error) {
            throw existing.error;
        }

        const now =
            new Date()
                .toISOString();

        if (existing.data) {

            const {
                error,
            } =
                await this
                    .tableRef()
                    .update({
                        is_active: true,
                        updated_at: now,
                    })
                    .eq(
                        "organization_id",
                        this.organizationId,
                    )
                    .eq(
                        "id",
                        existing.data.id,
                    );

            if (error) {
                throw error;
            }

            return;
        }

        const {
            error,
        } =
            await this
                .tableRef()
                .insert({
                    id:
                        crypto.randomUUID(),

                    organization_id:
                        this.organizationId,

                    user_id:
                        normalizedUserId,

                    role_id:
                        normalizedRoleId,

                    is_active:
                        true,

                    is_primary:
                        false,

                    assigned_at:
                        now,

                    updated_at:
                        now,
                });

        if (error) {
            throw error;
        }
    }


    async removeRole(
        userId: string,
        roleId: string,
    ): Promise<void> {

        const normalizedUserId =
            this.requireId(
                userId,
                "User id",
            );

        const normalizedRoleId =
            this.requireId(
                roleId,
                "Role id",
            );

        const {
            error,
        } =
            await this
                .tableRef()
                .update({
                    is_active: false,
                    is_primary: false,
                    updated_at:
                        new Date()
                            .toISOString(),
                })
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "user_id",
                    normalizedUserId,
                )
                .eq(
                    "role_id",
                    normalizedRoleId,
                );

        if (error) {
            throw error;
        }
    }


    async replaceRoles(
        userId: string,
        roleIds: string[],
    ): Promise<void> {

        const normalizedUserId =
            this.requireId(
                userId,
                "User id",
            );

        const uniqueRoleIds =
            [
                ...new Set(
                    roleIds
                        .map(
                            roleId =>
                                roleId?.trim(),
                        )
                        .filter(
                            (
                                roleId,
                            ): roleId is string =>
                                Boolean(roleId),
                        ),
                ),
            ];

        const now =
            new Date()
                .toISOString();

        const {
            error: deactivateError,
        } =
            await this
                .tableRef()
                .update({
                    is_active: false,
                    is_primary: false,
                    updated_at: now,
                })
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "user_id",
                    normalizedUserId,
                );

        if (deactivateError) {
            throw deactivateError;
        }

        if (
            uniqueRoleIds.length === 0
        ) {
            return;
        }

        for (
            const roleId
            of uniqueRoleIds
        ) {

            await this.assignRole(
                normalizedUserId,
                roleId,
            );
        }
    }


    async setPrimaryRole(
        userId: string,
        roleId: string,
    ): Promise<void> {

        const normalizedUserId =
            this.requireId(
                userId,
                "User id",
            );

        const normalizedRoleId =
            this.requireId(
                roleId,
                "Role id",
            );

        const {
            data,
            error: findError,
        } =
            await this
                .tableRef()
                .select("id")
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "user_id",
                    normalizedUserId,
                )
                .eq(
                    "role_id",
                    normalizedRoleId,
                )
                .eq(
                    "is_active",
                    true,
                )
                .maybeSingle();

        if (findError) {
            throw findError;
        }

        if (!data) {
            throw new Error(
                "Cannot set an inactive or unassigned role as primary.",
            );
        }

        const now =
            new Date()
                .toISOString();

        const {
            error: clearError,
        } =
            await this
                .tableRef()
                .update({
                    is_primary: false,
                    updated_at: now,
                })
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "user_id",
                    normalizedUserId,
                );

        if (clearError) {
            throw clearError;
        }

        const {
            error,
        } =
            await this
                .tableRef()
                .update({
                    is_primary: true,
                    updated_at: now,
                })
                .eq(
                    "organization_id",
                    this.organizationId,
                )
                .eq(
                    "id",
                    data.id,
                );

        if (error) {
            throw error;
        }
    }


    private requireId(
        value: string,
        fieldName: string,
    ): string {

        const normalized =
            value?.trim();

        if (!normalized) {
            throw new Error(
                `${fieldName} is required.`,
            );
        }

        return normalized;
    }


    private mapRole(
        row: UserRoleRow,
    ): UserRole {

        return {

            id:
                row.id,

            organizationId:
                row.organization_id,

            userId:
                row.user_id,

            roleId:
                row.role_id,

            isPrimary:
                row.is_primary
                ?? false,

            isActive:
                row.is_active
                ?? false,

            assignedBy:
                row.assigned_by
                ?? undefined,

            assignedAt:
                row.assigned_at
                ?? row.created_at,

            createdAt:
                row.created_at,

            updatedAt:
                row.updated_at,

        };
    }

}