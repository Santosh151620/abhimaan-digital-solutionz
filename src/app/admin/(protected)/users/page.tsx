import {
    getUsers,
} from "./page-actions";


import UsersClient
from "@/components/admin/users/UsersClient";


import type {
    AdminUser,
} from "@/types/admin/User";









export default async function UsersPage() {



    const users:AdminUser[] =

        await getUsers();







    return (



        <div

            className="

                space-y-6

            "

        >



            <div>



                <h1

                    className="

                        text-2xl

                        font-semibold

                    "

                >



                    Users



                </h1>







                <p

                    className="

                        text-sm

                        text-muted-foreground

                    "

                >



                    Manage organization users and access.



                </p>



            </div>









            <UsersClient



                initialUsers={users}



            />



        </div>



    );



}
