import type {
    Announcement,
} from "@/types/admin/Announcement";


import type {
    AnnouncementsRepository,
} from "@/repositories/admin/AnnouncementsRepository";



/**
 * ============================================================================
 * ADS ADMIN — ANNOUNCEMENTS SERVICE
 * ============================================================================
 *
 * Canonical business-service boundary for administrator announcements.
 *
 * Responsibilities:
 *
 * - Validate announcement input.
 * - Normalize user-provided identifiers and required text.
 * - Delegate persistence to the repository.
 * - Preserve the existing repository contract.
 * - Prevent invalid identifiers from reaching persistence.
 *
 * Architecture:
 *
 *   UI / Server Action
 *          ↓
 *   AnnouncementsService
 *          ↓
 *   AnnouncementsRepository
 *          ↓
 *   Persistence / Supabase
 *
 * The repository remains responsible for database access, tenant/security
 * enforcement and persistence semantics.
 * ============================================================================
 */


export class AnnouncementsService {


    constructor(

        private readonly repository:
            AnnouncementsRepository,

    ) {}



    /**
     * Return all announcements available to the repository context.
     */
    async list():

    Promise<Announcement[]> {

        return this.repository.findAll();

    }



    /**
     * Return currently published announcements.
     */
    async listPublished():

    Promise<Announcement[]> {

        return this.repository.findPublished();

    }



    /**
     * Find an announcement by identifier.
     */
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



    /**
     * Create or update an announcement.
     *
     * The repository remains the canonical persistence boundary. The service
     * only prepares and validates the business payload.
     */
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



    /**
     * Delete an existing announcement.
     *
     * Existence is checked first so callers receive a stable domain-level
     * error rather than relying on repository-specific behavior.
     */
    async delete(

        id: string,

    ):

    Promise<void> {

        const normalizedId =
            this.validateId(

                id,

            );


        const existing =
            await this.repository.findById(

                normalizedId,

            );


        if (!existing) {

            throw new Error(

                "Announcement not found.",

            );

        }


        await this.repository.delete(

            normalizedId,

        );

    }



    /**
     * Validate the announcement payload before persistence.
     */
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



    /**
     * Normalize required textual business values.
     */
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



    /**
     * Validate and normalize an entity identifier.
     */
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