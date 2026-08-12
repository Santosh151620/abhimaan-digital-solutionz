import type {
    AdminUser,
} from "@/types/admin/User";


import type {
    IUsersRepository,
} from "@/repositories/admin/UsersRepository";
export class UsersService {


    constructor(

        private readonly repository:
            IUsersRepository,

    ) {}

    async list():

    Promise<AdminUser[]> {

        return this.repository.list();

    }

    async active():

    Promise<AdminUser[]> {

        return this.repository.active();

    }

    async findById(

        id:string,

    ):

    Promise<AdminUser | null> {

        const normalizedId =
            this.validateId(
                id,
                "User",
            );


        return this.repository.findById(
            normalizedId,
        );

    }



    async findByEmail(

        email:string,

    ):

    Promise<AdminUser | null> {

        const normalizedEmail =
            this.normalizeEmail(
                email,
            );


        return this.repository.findByEmail(
            normalizedEmail,
        );

    }

    async save(

        user:AdminUser,

    ):

    Promise<AdminUser> {

        this.validateUser(
            user,
        );


        const email =
            this.normalizeEmail(
                user.email,
            );


        const existing =
            await this.repository.findByEmail(
                email,
            );


        if (

            existing &&

            existing.id !== user.id

        ) {

            throw new Error(
                "Email already exists.",
            );

        }


        return this.repository.save(

            {

                ...user,

                email,

                updatedAt:
                    new Date()
                        .toISOString(),

            },

        );

    }

    async updatePreferences(

        userId:string,

        _preferences:
            Record<string,unknown>,

    ):

    Promise<void> {

        this.validateId(
            userId,
            "User",
        );


        throw new Error(

            "User preference management is handled by UserPreferenceService.",

        );

    }
    async delete(

        id:string,

    ):

    Promise<void> {

        const normalizedId =
            this.validateId(
                id,
                "User",
            );


        const user =
            await this.repository.findById(
                normalizedId,
            );


        if (!user) {

            throw new Error(
                "User not found.",
            );

        }


        if (

            user.userType === "System"

        ) {

            throw new Error(
                "System users cannot be deleted.",
            );

        }


        await this.repository.delete(
            normalizedId,
        );

    }
    private validateUser(

        user:AdminUser,

    ):void {

        if (!user) {

            throw new Error(
                "User is required.",
            );

        }


        if (
            !user.fullName?.trim()
        ) {

            throw new Error(
                "Full name is required.",
            );

        }


        this.normalizeEmail(
            user.email,
        );


        if (
            !user.userType
        ) {

            throw new Error(
                "User type is required.",
            );

        }


        if (
            !user.status
        ) {

            throw new Error(
                "User status is required.",
            );

        }

    }

    private normalizeEmail(

        email:string,

    ):string {

        if (
            !email?.trim()
        ) {

            throw new Error(
                "Email is required.",
            );

        }


        const normalized =
            email
                .trim()
                .toLowerCase();


        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailRegex.test(
                normalized,
            )
        ) {

            throw new Error(
                "Invalid email address.",
            );

        }


        return normalized;

    }



    /**
     * Validate and normalize an entity identifier.
     */
    private validateId(

        id:string,

        entity:string,

    ):string {

        const normalized =
            id?.trim();


        if (!normalized) {

            throw new Error(
                `${entity} id is required.`,
            );

        }


        return normalized;

    }


}
