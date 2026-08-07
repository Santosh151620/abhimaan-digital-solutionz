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









    async findById(

        id:string,

    ):

    Promise<AdminUser | null> {



        this.validateId(

            id,

            "User",

        );







        return this.repository.findById(

            id,

        );



    }









    async findByEmail(

        email:string,

    ):

    Promise<AdminUser | null> {



        if(!email?.trim()) {



            throw new Error(

                "Email is required."

            );



        }







        return this.repository.findByEmail(

            email

                .trim()

                .toLowerCase(),

        );



    }









    async save(

        user:AdminUser,

    ):

    Promise<void> {



        this.validateUser(

            user,

        );







        const normalizedEmail =

            user.email

                .trim()

                .toLowerCase();







        const existing =

            await this.repository.findByEmail(

                normalizedEmail,

            );







        if(

            existing &&

            existing.id !== user.id

        ) {



            throw new Error(

                "Email already exists."

            );



        }







        await this.repository.save(

            {

                ...user,


                email:

                    normalizedEmail,


                updatedAt:

                    new Date()

                    .toISOString(),

            },

        );



    }









    async delete(

        id:string,

    ):

    Promise<void> {



        this.validateId(

            id,

            "User",

        );







        const user =

            await this.repository.findById(

                id,

            );







        if(!user) {



            throw new Error(

                "User not found."

            );



        }







        if(

            user.userType === "System"

        ) {



            throw new Error(

                "System users cannot be deleted."

            );



        }







        await this.repository.delete(

            id,

        );



    }









    private validateUser(

        user:AdminUser,

    ) {



        if(!user.fullName?.trim()) {



            throw new Error(

                "Full name is required."

            );



        }







        if(!user.email?.trim()) {



            throw new Error(

                "Email is required."

            );



        }







        const email =

            user.email

                .trim()

                .toLowerCase();







        const emailRegex =

            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;







        if(!emailRegex.test(email)) {



            throw new Error(

                "Invalid email address."

            );



        }







        if(!user.userType) {



            throw new Error(

                "User type is required."

            );



        }







        if(!user.status) {



            throw new Error(

                "User status is required."

            );



        }



    }









    private validateId(

        id:string,

        entity:string,

    ) {



        if(!id?.trim()) {



            throw new Error(

                `${entity} id is required.`

            );



        }



    }



}