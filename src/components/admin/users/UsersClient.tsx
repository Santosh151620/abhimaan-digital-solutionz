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

    users: AdminUser[];

}



export default function UsersClient({

    users,

}: UsersClientProps) {


    const router =
        useRouter();



    const [
        selectedUser,
        setSelectedUser
    ] =
    useState<AdminUser | undefined>();



    const [
        dialogOpen,
        setDialogOpen
    ] =
    useState(false);



    const [
        loading,
        setLoading
    ] =
    useState(false);



    const [
        error,
        setError
    ] =
    useState<string | null>(null);





    function openCreate() {

        setSelectedUser(
            undefined
        );

        setError(
            null
        );

        setDialogOpen(
            true
        );

    }





    function openEdit(

        user: AdminUser,

    ) {


        setSelectedUser(
            user
        );


        setError(
            null
        );


        setDialogOpen(
            true
        );


    }





    function closeDialog() {


        setDialogOpen(
            false
        );


        setSelectedUser(
            undefined
        );


    }





    async function handleDelete(

        id: string,

    ) {


        const confirmed =
            window.confirm(
                "Are you sure you want to delete this user?"
            );


        if (!confirmed) {

            return;

        }



        try {


            setLoading(
                true
            );


            setError(
                null
            );


            await deleteUser(
                id
            );


            router.refresh();



        }
        catch (error) {


            setError(

                error instanceof Error

                ? error.message

                : "Unable to delete user"

            );


        }
        finally {


            setLoading(
                false
            );


        }


    }





    return (

        <div
            className="space-y-6"
        >


            <section
                className="
                flex
                items-center
                justify-between
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

                        Manage organization users,
                        identity and access.

                    </p>


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


            </section>





            {
                error && (

                    <div

                        className="
                        rounded-md
                        border
                        border-destructive
                        p-3
                        text-sm
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

                        onClose={closeDialog}

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