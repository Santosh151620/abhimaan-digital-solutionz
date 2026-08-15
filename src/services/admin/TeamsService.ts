import type {
    Team,
} from "@/types/admin/Team";


import {
    TeamsRepository,
} from "@/repositories/admin/TeamsRepository";



/**
 * ============================================================================
 * ADS ADMIN — TEAMS SERVICE
 * ============================================================================
 *
 * Canonical business-service boundary for administration teams.
 *
 * Responsibilities:
 *
 * - Validate team input.
 * - Normalize team identifiers and codes.
 * - Prevent duplicate team codes.
 * - Delegate persistence to TeamsRepository.
 * - Preserve repository-level tenant/security/RLS responsibilities.
 * - Keep business rules out of UI/server-action layers.
 *
 * This service intentionally reuses the existing TeamsRepository contract.
 * No database/schema assumptions are introduced here.
 * ============================================================================
 */


export class TeamsService {


    constructor(

        private readonly repository:
            TeamsRepository,

    ) {}



    /**
     * Return all teams available through the repository security boundary.
     */
    async getAll():

    Promise<Team[]> {


        return this.repository.findAll();

    }



    /**
     * Find a team by identifier.
     */
    async findById(

        id: string,

    ):

    Promise<Team | null> {


        const normalizedId =
            this.validateId(
                id,
            );


        return this.repository.findById(

            normalizedId,

        );

    }



    /**
     * Create or update a team.
     *
     * The repository remains responsible for persistence.
     * This service owns normalization and business validation.
     */
    async save(

        team: Partial<Team>,

    ):

    Promise<Team> {


        const normalizedTeam =
            this.validateTeam(
                team,
            );


        const normalizedId =
            team.id
                ? this.validateId(
                    team.id,
                )
                : undefined;


        const existing =
            await this.repository.findById(
                normalizedId ?? "",
            );


        /*
         * A save operation may represent either creation or update.
         *
         * When an ID exists, validate that the current record is real.
         * This prevents silently treating an invalid update as a create.
         *
         * For new teams, duplicate teamCode protection is performed against
         * the repository dataset because the existing repository contract
         * exposes findAll() rather than a dedicated findByCode().
         */
        if (normalizedId) {


            if (!existing) {

                throw new Error(
                    "Team not found.",
                );

            }


            if (
                existing.teamCode !==
                normalizedTeam.teamCode
            ) {

                const teams =
                    await this.repository.findAll();


                const duplicate =
                    teams.some(

                        item =>
                            item.id !==
                                normalizedId &&

                            this.normalizeCode(
                                item.teamCode,
                            ) ===
                                normalizedTeam
                                    .teamCode,

                    );


                if (duplicate) {

                    throw new Error(
                        "Team code already exists.",
                    );

                }

            }


        } else {


            const teams =
                await this.repository.findAll();


            const duplicate =
                teams.some(

                    item =>
                        this.normalizeCode(
                            item.teamCode,
                        ) ===
                            normalizedTeam
                                .teamCode,

                );


            if (duplicate) {

                throw new Error(
                    "Team code already exists.",
                );

            }

        }


        return this.repository.save(

            {

                ...team,

                ...(normalizedId
                    ? {
                        id:
                            normalizedId,
                    }
                    : {}),

                teamCode:
                    normalizedTeam.teamCode,

                teamName:
                    normalizedTeam.teamName,

            },

        );

    }



    /**
     * Delete a team.
     *
     * The repository determines the actual persistence semantics
     * (soft-delete/archive/hard-delete) according to the existing
     * application contract.
     */
    async delete(

        id: string,

    ):

    Promise<void> {


        const normalizedId =
            this.validateId(
                id,
            );


        const team =
            await this.repository.findById(

                normalizedId,

            );


        if (!team) {

            throw new Error(
                "Team not found.",
            );

        }


        await this.repository.delete(

            normalizedId,

        );

    }



    /**
     * Validate and normalize team input.
     */
    private validateTeam(

        team: Partial<Team>,

    ): {

        teamCode: string;

        teamName: string;

    } {


        if (

            !team ||

            typeof team !==
                "object" ||

            Array.isArray(team)

        ) {

            throw new Error(
                "Team is required.",
            );

        }


        const teamCode =
            this.normalizeCode(
                team.teamCode ?? "",
            );


        const teamName =
            typeof team.teamName ===
                "string"

                ? team.teamName.trim()

                : "";


        if (!teamName) {

            throw new Error(
                "Team name is required.",
            );

        }


        return {

            teamCode,

            teamName,

        };

    }



    /**
     * Normalize and validate team code.
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
                "Team code is required.",
            );

        }


        return normalizedCode;

    }



    /**
     * Normalize and validate team identifier.
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
                "Team id is required.",
            );

        }


        return normalizedId;

    }

}
