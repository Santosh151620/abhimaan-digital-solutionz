import type {
    Announcement,
} from "@/types/admin/Announcement";

import {
    AnnouncementsRepository,
} from "@/repositories/admin/AnnouncementsRepository";

export class AnnouncementsService {

    constructor(

        private readonly repository =
            new AnnouncementsRepository(),

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

        this.validateId(
            id,
        );

        return this.repository.findById(
            id.trim(),
        );

    }

    async save(

        announcement: Partial<Announcement>,

    ):

    Promise<Announcement> {

        this.validateAnnouncement(
            announcement,
        );

        return this.repository.save({

            ...announcement,

            title:
                announcement.title!
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

    private validateAnnouncement(

        announcement: Partial<Announcement>,

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

    ): void {

        if (!id?.trim()) {

            throw new Error(
                "Announcement id is required.",
            );

        }

    }

}

export const announcementsService =
    new AnnouncementsService();