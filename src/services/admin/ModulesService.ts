import type {
    PlatformModule,
} from "@/types/admin/Module";


import type {
    IModulesRepository,
} from "@/repositories/admin/ModulesRepository";



/**
 * ============================================================================
 * ADS ADMIN — MODULES SERVICE
 * ============================================================================
 *
 * Canonical business-service boundary for platform modules.
 *
 * Responsibilities:
 *
 * - Validate and normalize module input.
 * - Enforce module-code uniqueness.
 * - Validate module dependency integrity.
 * - Prevent self-dependencies.
 * - Protect system modules from deletion.
 * - Delegate persistence to ModulesRepository.
 *
 * Architecture:
 *
 *   UI / Server Action
 *          ↓
 *   ModulesService
 *          ↓
 *   ModulesRepository
 *          ↓
 *   Persistence
 *
 * Security / tenant / persistence concerns remain below this boundary.
 * ============================================================================
 */


export class ModulesService {


    constructor(

        private readonly repository:
            IModulesRepository,

    ) {}



    /**
     * Return all platform modules.
     */
    async list():

    Promise<PlatformModule[]> {

        return this.repository.list();

    }



    /**
     * Find a module by identifier.
     */
    async findById(

        id: string,

    ):

    Promise<PlatformModule | null> {

        const normalizedId =
            this.validateId(
                id,
            );


        return this.repository.findById(

            normalizedId,

        );

    }



    /**
     * Find a module by normalized business code.
     */
    async findByCode(

        code: string,

    ):

    Promise<PlatformModule | null> {

        const normalizedCode =
            this.normalizeCode(
                code,
            );


        return this.repository.findByCode(

            normalizedCode,

        );

    }



    /**
     * Determine whether a module is currently enabled.
     */
    async isEnabled(

        code: string,

    ):

    Promise<boolean> {

        const platformModule =
            await this.findByCode(
                code,
            );


        return (

            platformModule?.status ===
            "Active"

        );

    }



    /**
     * Verify that all declared module dependencies are active.
     *
     * Dependencies are interpreted as module codes.
     */
    async dependenciesSatisfied(

        platformModule:
            PlatformModule,

    ):

    Promise<boolean> {

        if (

            !platformModule ||

            typeof platformModule !== "object"

        ) {

            throw new Error(

                "Platform module is required.",

            );

        }


        const moduleCode =
            this.normalizeCode(
                platformModule.code,
            );


        const dependencies =
            this.normalizeDependencies(
                platformModule.dependencies,
            );


        if (!dependencies.length) {

            return true;

        }


        if (

            dependencies.includes(
                moduleCode,
            )

        ) {

            throw new Error(

                "A module cannot depend on itself.",

            );

        }


        const modules =
            await this.repository.list();


        const activeCodes =
            new Set(

                modules

                    .filter(
                        item =>
                            item.status ===
                            "Active",
                    )

                    .map(
                        item =>
                            this.normalizeCode(
                                item.code,
                            ),
                    ),

            );


        return dependencies.every(

            dependency =>
                activeCodes.has(
                    dependency,
                ),

        );

    }



    /**
     * Create or update a platform module.
     *
     * Module code uniqueness is enforced before persistence.
     */
    async save(

        module:
            PlatformModule,

    ):

    Promise<void> {

        const normalizedModule =
            this.validateModule(
                module,
            );


        const normalizedId =
            module.id
                ? this.validateId(
                    module.id,
                )
                : undefined;


        const existing =
            await this.repository.findByCode(

                normalizedModule.code,

            );


        if (

            existing &&

            existing.id !== normalizedId

        ) {

            throw new Error(

                "Module code already exists.",

            );

        }


        const normalizedDependencies =
            this.normalizeDependencies(
                module.dependencies,
            );


        if (

            normalizedDependencies.includes(
                normalizedModule.code,
            )

        ) {

            throw new Error(

                "A module cannot depend on itself.",

            );

        }


        const moduleForValidation = {

            ...module,

            ...(normalizedId
                ? {
                    id:
                        normalizedId,
                }
                : {}),

            code:
                normalizedModule.code,

            name:
                normalizedModule.name,

            dependencies:
                normalizedDependencies,

        };


        const dependenciesSatisfied =
            await this.dependenciesSatisfied(

                moduleForValidation,

            );


        if (!dependenciesSatisfied) {

            throw new Error(

                "Module dependencies are not satisfied.",

            );

        }


        await this.repository.save(

            {

                ...moduleForValidation,

                updatedAt:
                    new Date()
                        .toISOString(),

            },

        );

    }



    /**
     * Delete a non-system module.
     */
    async delete(

        id: string,

    ):

    Promise<void> {

        const normalizedId =
            this.validateId(
                id,
            );


        const existingModule =
            await this.repository.findById(

                normalizedId,

            );


        if (!existingModule) {

            throw new Error(

                "Module not found.",

            );

        }


        if (existingModule.isSystem) {

            throw new Error(

                "System modules cannot be deleted.",

            );

        }


        await this.repository.delete(

            normalizedId,

        );

    }



    /**
     * Validate required module fields and return normalized values.
     */
    private validateModule(

        module:
            PlatformModule,

    ): {

        code: string;

        name: string;

    } {

        if (

            !module ||

            typeof module !== "object" ||

            Array.isArray(module)

        ) {

            throw new Error(

                "Platform module is required.",

            );

        }


        const code =
            this.normalizeCode(
                module.code,
            );


        const name =
            typeof module.name ===
            "string"

                ? module.name.trim()

                : "";


        if (!name) {

            throw new Error(

                "Module name is required.",

            );

        }


        if (!module.status) {

            throw new Error(

                "Module status is required.",

            );

        }


        return {

            code,

            name,

        };

    }



    /**
     * Normalize a module-code value.
     */
    private normalizeCode(

        code: string,

    ): string {

        const normalizedCode =
            typeof code ===
            "string"

                ? code
                    .trim()
                    .toUpperCase()

                : "";


        if (!normalizedCode) {

            throw new Error(

                "Module code is required.",

            );

        }


        if (

            !/^[A-Z0-9][A-Z0-9_-]*$/.test(
                normalizedCode,
            )

        ) {

            throw new Error(

                "Module code may contain only letters, numbers, underscores, and hyphens.",

            );

        }


        return normalizedCode;

    }



    /**
     * Normalize dependency codes and remove duplicates.
     */
    private normalizeDependencies(

        dependencies:
            readonly string[] |
            null |
            undefined,

    ): string[] {

        if (!dependencies) {

            return [];

        }


        if (!Array.isArray(dependencies)) {

            throw new Error(

                "Module dependencies must be an array.",

            );

        }


        const normalized =
            dependencies.map(

                dependency => {

                    if (
                        typeof dependency !==
                        "string"
                    ) {

                        throw new Error(

                            "Module dependency codes must be strings.",

                        );

                    }


                    return this.normalizeCode(
                        dependency,
                    );

                },

            );


        return Array.from(

            new Set(
                normalized,
            ),

        );

    }



    /**
     * Validate and normalize an entity identifier.
     */
    private validateId(

        id: string,

    ): string {

        const normalizedId =
            typeof id ===
            "string"

                ? id.trim()

                : "";


        if (!normalizedId) {

            throw new Error(

                "Module id is required.",

            );

        }


        return normalizedId;

    }

}