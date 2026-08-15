import type {
    RolePermission,
} from "@/types/admin/RolePermission";


import type {
    IRolePermissionRepository,
} from "@/repositories/admin/RolePermissionRepository";



/**
 * ============================================================================
 * ADS ADMIN — ROLE PERMISSION SERVICE
 * ============================================================================
 *
 * Canonical business-service boundary for role/permission assignments.
 *
 * Responsibilities:
 *
 * - Validate and normalize role and permission identifiers.
 * - Prevent duplicate role-permission assignments.
 * - Normalize replacement permission collections.
 * - Delegate persistence exclusively to the repository.
 * - Keep persistence and database concerns outside the service layer.
 *
 * Architecture:
 *
 *   UI / Server Action
 *          ↓
 *   RolePermissionService
 *          ↓
 *   IRolePermissionRepository
 *          ↓
 *   Persistence / Supabase
 *
 * IMPORTANT:
 *
 * Authorization, organization/security enforcement and persistence remain
 * below this boundary according to the existing repository architecture.
 * ============================================================================
 */


export class RolePermissionService {


    constructor(

        private readonly repository:
            IRolePermissionRepository,

    ) {}



    /**
     * Return all permission assignments for a role.
     */
    async listByRole(

        roleId: string,

    ):

    Promise<RolePermission[]> {

        const normalizedRoleId =
            this.validateId(
                roleId,
                "Role",
            );


        return this.repository.listByRole(

            normalizedRoleId,

        );

    }



    /**
     * Assign a permission to a role.
     *
     * Assignment is idempotent. If the relationship already exists,
     * no duplicate persistence operation is performed.
     */
    async assign(

        roleId: string,

        permissionId: string,

    ):

    Promise<void> {

        const normalizedRoleId =
            this.validateId(
                roleId,
                "Role",
            );


        const normalizedPermissionId =
            this.validateId(
                permissionId,
                "Permission",
            );


        const existing =
            await this.repository.listByRole(

                normalizedRoleId,

            );


        const alreadyAssigned =
            existing.some(

                item =>

                    item.permissionId ===
                    normalizedPermissionId,

            );


        if (alreadyAssigned) {

            return;

        }


        await this.repository.assign(

            normalizedRoleId,

            normalizedPermissionId,

        );

    }



    /**
     * Revoke a permission from a role.
     *
     * Revoke remains intentionally idempotent so callers do not need to
     * perform a read before attempting removal.
     */
    async revoke(

        roleId: string,

        permissionId: string,

    ):

    Promise<void> {

        const normalizedRoleId =
            this.validateId(
                roleId,
                "Role",
            );


        const normalizedPermissionId =
            this.validateId(
                permissionId,
                "Permission",
            );


        await this.repository.revoke(

            normalizedRoleId,

            normalizedPermissionId,

        );

    }



    /**
     * Replace the complete permission assignment set for a role.
     *
     * Empty arrays are valid and intentionally mean that all existing
     * assignments should be removed.
     *
     * Duplicate IDs and surrounding whitespace are removed before the
     * repository is called.
     */
    async replace(

        roleId: string,

        permissionIds: string[],

    ):

    Promise<void> {

        const normalizedRoleId =
            this.validateId(
                roleId,
                "Role",
            );


        if (!Array.isArray(permissionIds)) {

            throw new Error(
                "Permission ids are required.",
            );

        }


        const uniquePermissions =
            this.normalizeIds(
                permissionIds,
                "Permission",
            );


        await this.repository.replace(

            normalizedRoleId,

            uniquePermissions,

        );

    }



    /**
     * Normalize a collection of entity identifiers.
     *
     * Invalid non-string entries are rejected rather than silently dropped.
     * This prevents malformed authorization payloads from being accepted.
     */
    private normalizeIds(

        ids: string[],

        entity: string,

    ): string[] {

        return Array.from(

            new Set(

                ids.map(

                    (id, index) => {

                        if (
                            typeof id !== "string"
                        ) {

                            throw new Error(
                                `${entity} id at index ${index} is invalid.`,
                            );

                        }


                        const normalized =
                            id.trim();


                        if (!normalized) {

                            throw new Error(
                                `${entity} id at index ${index} is required.`,
                            );

                        }


                        return normalized;

                    },

                ),

            ),

        );

    }



    /**
     * Validate and normalize a single entity identifier.
     */
    private validateId(

        id: string,

        entity: string,

    ): string {

        const normalized =
            typeof id === "string"
                ? id.trim()
                : "";


        if (!normalized) {

            throw new Error(
                `${entity} id is required.`,
            );

        }


        return normalized;

    }

}