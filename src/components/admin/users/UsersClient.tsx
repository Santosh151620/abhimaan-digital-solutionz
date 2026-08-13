"use client";


import {
    useState,
} from "react";


import {
    useRouter,
} from "next/navigation";


import type {
    AdminUser,
} from "@/types/admin/User";


import UsersTable
from "./UsersTable";


import UserDialog
from "./UserDialog";


import {
    deleteUser,
} from "@/app/admin/(protected)/users/actions";





interface UsersClientProps {

    initialUsers:AdminUser[];

    organizationId:string;

}






export default function UsersClient({

    initialUsers,

    organizationId,

}:UsersClientProps) {



    const router =
        useRouter();



    const [
        users,
        setUsers,
    ] = useState<AdminUser[]>(

        initialUsers,

    );



    const [
        selectedUser,
        setSelectedUser,
    ] = useState<AdminUser | undefined>();



    const [
        dialogOpen,
        setDialogOpen,
    ] = useState(false);



    const [
        loading,
        setLoading,
    ] = useState(false);



    const [
        error,
        setError,
    ] = useState<string | null>(null);






    function openCreate() {


        setSelectedUser(
            undefined,
        );


        setDialogOpen(
            true,
        );


        setError(
            null,
        );

    }







    function openEdit(

        user:AdminUser,

    ) {


        setSelectedUser(
            user,
        );


        setDialogOpen(
            true,
        );


        setError(
            null,
        );

    }







    function closeDialog() {


        setDialogOpen(
            false,
        );


        setSelectedUser(
            undefined,
        );

    }








    async function handleDelete(

        id:string,

    ) {



        if(

            !window.confirm(
                "Delete this user?",
            )

        ) {

            return;

        }



        try {


            setLoading(true);

            setError(null);



            await deleteUser(
                id,
            );



            setUsers(

                previous =>

                    previous.filter(

                        item =>

                            item.id !== id,

                    ),

            );



            router.refresh();



        }
        catch(error) {


            setError(

                error instanceof Error

                ? error.message

                : "Unable to delete user.",

            );


        }
        finally {


            setLoading(false);

        }


    }








    return (

        <div className="space-y-6">



            <div

                className="
                    flex
                    items-center
                    justify-between
                "

            >

                <div>


                    <h2

                        className="
                            text-xl
                            font-semibold
                        "

                    >

                        User Registry

                    </h2>


                </div>




                <button

                    type="button"

                    onClick={openCreate}

                    className="
                        rounded-md
                        bg-primary
                        px-4
                        py-2
                        text-primary-foreground
                    "

                >

                    Add User

                </button>


            </div>






            {
                error && (

                    <div

                        className="
                            rounded-md
                            border
                            border-destructive
                            p-3
                            text-destructive
                        "

                    >

                        {error}

                    </div>

                )
            }







            <UsersTable

                users={users}

                onEdit={openEdit}

                onDelete={handleDelete}

            />







            {
                dialogOpen && (

                    <UserDialog


                        user={selectedUser}


                        organizationId={organizationId}


                        onClose={() => {


                            closeDialog();


                            router.refresh();


                        }}


                    />

                )
            }







            {
                loading && (

                    <div

                        className="
                            fixed
                            bottom-6
                            right-6
                            rounded-md
                            border
                            bg-background
                            px-4
                            py-2
                            shadow
                        "

                    >

                        Processing...

                    </div>

                )
            }



        </div>

    );

}