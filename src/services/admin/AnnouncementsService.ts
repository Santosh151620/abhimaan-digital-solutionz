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


        const title =
            announcement.title!.trim();


        return this.repository.save(

            {

                ...announcement,

                title,

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


        await this.repository.delete(

            normalizedId,

        );

    }


    private validateAnnouncement(

        announcement:
            Partial<Announcement>,

    ): void {

        if (!announcement) {

            throw new Error(

                "Announcement is required.",

            );

        }


        if (
            !announcement.title?.trim()
        ) {

            throw new Error(

                "Announcement title is required.",

            );

        }

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