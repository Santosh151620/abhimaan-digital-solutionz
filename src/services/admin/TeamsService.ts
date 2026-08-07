import type {
    Team,
} from "@/types/admin/Team";

import {
    TeamsRepository,
} from "@/repositories/admin/TeamsRepository";

export class TeamsService {

    constructor(

        private readonly repository =
            new TeamsRepository(),

    ) {}

    async getAll():

    Promise<Team[]> {

        return this.repository.findAll();

    }

    async findById(

        id: string,

    ):

    Promise<Team | null> {

        this.validateId(
            id,
        );

        return this.repository.findById(
            id.trim(),
        );

    }

    async save(

        team: Partial<Team>,

    ):

    Promise<Team> {

        this.validateTeam(
            team,
        );

        return this.repository.save({

            ...team,

            teamCode:
                team.teamCode!
                    .trim()
                    .toUpperCase(),

            teamName:
                team.teamName!
                    .trim(),

        });

    }

    async delete(

        id: string,

    ):

    Promise<void> {

        this.validateId(
            id,
        );

        await this.repository.delete(
            id.trim(),
        );

    }

    private validateTeam(

        team: Partial<Team>,

    ): void {

        if (!team) {

            throw new Error(
                "Team is required.",
            );

        }

        if (
            !team.teamCode?.trim()
        ) {

            throw new Error(
                "Team code is required.",
            );

        }

        if (
            !team.teamName?.trim()
        ) {

            throw new Error(
                "Team name is required.",
            );

        }

    }

    private validateId(

        id: string,

    ): void {

        if (!id?.trim()) {

            throw new Error(
                "Team id is required.",
            );

        }

    }

}

export const teamsService =
    new TeamsService();