import type {
    Role,
} from "@/types/admin/Role";


import type {
    IRolesRepository,
} from "@/repositories/admin/RolesRepository";



/**
 * ============================================================================
 * ADS ADMIN — ROLES SERVICE
 * ============================================================================
 *
 * Canonical business-service boundary for administrative roles.
 *
 * Responsibilities:
 *
 * - Validate role input.
 * - Normalize role identifiers.
 * - Prevent duplicate role codes.
 * - Protect system roles from deletion.
 * - Delegate persistence exclusively to the repository.
 * - Keep repository/database concerns outside the service layer.
 *
 * Architecture:
 *
 *   UI / Server Action
 *          ↓
 *   RolesService
 *          ↓
 *   IRolesRepository
 *          ↓
 *   Persistence / Supabase
 *
 * IMPORTANT:
 *
 * This service deliberately does not access Supabase directly.
 * Authorization, tenant/security enforcement and persistence remain below
 * this boundary according to the existing repository architecture.
 * ============================================================================
 */


export class RolesService {


    constructor(

        private readonly repository:
            IRolesRepository,

    ) {}



    /**
     * Return all roles.
     */
    async list():

    Promise<Role[]> {

        return this.repository.list();

    }



    /**
     * Return active roles only.
     */
    async active():

    Promise<Role[]> {

        return this.repository.active();

    }



    /**
     * Find a role by identifier.
     */
    async findById(

        id: string,

    ):

    Promise<Role | null> {

        const normalizedId =
            this.validateId(
                id,
                "Role",
            );


        return this.repository.findById(

            normalizedId,

        );

    }



    /**
     * Find a role by normalized role code.
     */
    async findByCode(

        code: string,

    ):

    Promise<Role | null> {

        const normalizedCode =
            this.normalizeCode(
                code,
            );


        return this.repository.findByCode(

            normalizedCode,

        );

    }



    /**
     * Create or update a role.
     *
     * Existing callers continue to provide a complete Role object.
     *
     * Business validation and normalization happen before persistence.
     * Duplicate role codes are rejected unless the existing role is the
     * same record being updated.
     */
    async save(

        role: Role,

    ): Promise<Role> {

        this.validateRole(
            role,
        );


        const normalizedId =
            this.validateId(
                role.id,
                "Role",
            );


        const normalizedCode =
            this.normalizeCode(
                role.code,
            );


        const normalizedName =
            this.normalizeName(
                role.name,
            );


        const existing =
            await this.repository.findByCode(

                normalizedCode,

            );


        if (

            existing &&

            existing.id !== normalizedId

        ) {

            throw new Error(
                "Role code already exists.",
            );

        }


        return this.repository.save(

            {

                ...role,

                id:
                    normalizedId,

                name:
                    normalizedName,

                code:
                    normalizedCode,

                description:
                    this.normalizeOptionalText(
                        role.description,
                    ),

                updatedAt:
                    new Date().toISOString(),

            },

        );

    }



    /**
     * Delete a role.
     *
     * System roles are protected from deletion.
     */
    async delete(

        id: string,

    ): Promise<void> {

        const normalizedId =
            this.validateId(
                id,
                "Role",
            );


        const role =
            await this.repository.findById(

                normalizedId,

            );


        if (!role) {

            throw new Error(
                "Role not found.",
            );

        }


        if (role.isSystem) {

            throw new Error(
                "System roles cannot be deleted.",
            );

        }


        await this.repository.delete(

            normalizedId,

        );

    }



    /**
     * Validate the complete role contract before persistence.
     */
    private validateRole(

        role: Role,

    ): void {

        if (

            !role ||

            typeof role !== "object" ||

            Array.isArray(role)

        ) {

            throw new Error(
                "Role is required.",
            );

        }


        this.validateId(
            role.id,
            "Role",
        );


        this.normalizeName(
            role.name,
        );


        this.normalizeCode(
            role.code,
        );


        if (!role.type) {

            throw new Error(
                "Role type is required.",
            );

        }


        if (!role.level) {

            throw new Error(
                "Role level is required.",
            );

        }


        if (!role.status) {

            throw new Error(
                "Role status is required.",
            );

        }

    }



    /**
     * Normalize role names while preserving user-facing capitalization.
     */
    private normalizeName(

        name: string,

    ): string {

        const normalized =
            typeof name === "string"
                ? name.trim()
                : "";


        if (!normalized) {

            throw new Error(
                "Role name is required.",
            );

        }


        return normalized;

    }



    /**
     * Normalize and validate the persistent role code.
     *
     * Role codes are canonicalized to lowercase to ensure deterministic
     * duplicate detection and repository lookups.
     */
    private normalizeCode(

        code: string,

    ): string {

        const normalized =
            typeof code === "string"
                ? code.trim().toLowerCase()
                : "";


        if (!normalized) {

            throw new Error(
                "Role code is required.",
            );

        }


        if (

            !/^[a-z0-9_-]+$/.test(
                normalized,
            )

        ) {

            throw new Error(
                "Role code may contain only lowercase letters, numbers, underscores, and hyphens.",
            );

        }


        return normalized;

    }



    /**
     * Normalize optional descriptive fields.
     *
     * Empty strings are persisted as undefined rather than meaningless
     * whitespace values.
     */
    private normalizeOptionalText(

        value:
            string | null | undefined,

    ):

    string | undefined {

        if (
            typeof value !== "string"
        ) {

            return undefined;

        }


        const normalized =
            value.trim();


        return normalized || undefined;

    }



    /**
     * Validate and normalize entity identifiers.
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