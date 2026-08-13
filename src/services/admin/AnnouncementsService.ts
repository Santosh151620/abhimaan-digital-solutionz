import type {
    Announcement,
} from "@/types/admin/Announcement";


import type {
    AnnouncementsRepository,
} from "@/repositories/admin/AnnouncementsRepository";


export class AnnouncementsService {


    constructor(

        private readonly repository:
            AnnouncementsRepository,

    ) {}



    async list():

    Promise<Announcement[]> {

        return this.repository.findAll();

    }



    async listPublished():

    Promise<Announcement[]> {

        return this.repository.findPublished();

    }



    async findById(

        id: string,

    ):

    Promise<Announcement | null> {

        const normalizedId =
            this.validateId(
                id,
            );


        return this.repository.findById(

            normalizedId,

        );

    }



    async save(

        announcement:
            Partial<Announcement>,

    ):

    Promise<Announcement> {

        this.validateAnnouncement(

            announcement,

        );


        const normalizedTitle =
            this.normalizeRequiredText(

                announcement.title,

                "Announcement title is required.",

            );


        return this.repository.save(

            {

                ...announcement,

                title:
                    normalizedTitle,

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


        const announcement =
            await this.repository.findById(

                normalizedId,

            );


        if (!announcement) {

            throw new Error(

                "Announcement not found.",

            );

        }


        await this.repository.delete(

            normalizedId,

        );

    }



    private validateAnnouncement(

        announcement:
            Partial<Announcement>,

    ): void {

        if (

            !announcement ||

            typeof announcement !==
                "object" ||

            Array.isArray(
                announcement,
            )

        ) {

            throw new Error(

                "Announcement is required.",

            );

        }


        this.normalizeRequiredText(

            announcement.title,

            "Announcement title is required.",

        );

    }



    private normalizeRequiredText(

        value:
            string |
            null |
            undefined,

        message: string,

    ): string {

        const normalized =
            typeof value === "string"
                ? value.trim()
                : "";


        if (!normalized) {

            throw new Error(

                message,

            );

        }


        return normalized;

    }



    private validateId(

        id: string,

    ): string {

        const normalizedId =
            typeof id === "string"
                ? id.trim()
                : "";


        if (!normalizedId) {

            throw new Error(

                "Announcement id is required.",

            );

        }


        return normalizedId;

    }

}
