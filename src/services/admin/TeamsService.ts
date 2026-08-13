import type {
    Team,
} from "@/types/admin/Team";


import {
    TeamsRepository,
} from "@/repositories/admin/TeamsRepository";





export class TeamsService {





    constructor(

        private readonly repository:
            TeamsRepository,

    ) {}









    async getAll():

    Promise<Team[]> {


        return this.repository.findAll();


    }









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









    async save(

        team: Partial<Team>,

    ):

    Promise<Team> {


        const normalizedTeam =
            this.validateTeam(

                team,

            );



        return this.repository.save(

            {

                ...team,


                teamCode:
                    normalizedTeam.teamCode,


                teamName:
                    normalizedTeam.teamName,

            },

        );


    }

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

    private validateTeam(

        team: Partial<Team>,

    ): {

        teamCode: string;

        teamName: string;

    } {


        if (!team) {


            throw new Error(

                "Team is required.",

            );


        }



        const teamCode =

            typeof team.teamCode ===
            "string"

                ? team.teamCode
                    .trim()
                    .toUpperCase()

                : "";



        if (!teamCode) {


            throw new Error(

                "Team code is required.",

            );


        }



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