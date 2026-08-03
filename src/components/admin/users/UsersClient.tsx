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
        deleting,
        setDeleting
    ] =
    useState(false);



    const [
        error,
        setError
    ] =
    useState<string | null>(null);





    function openCreate(){

        setSelectedUser(
            undefined
        );

        setDialogOpen(
            true
        );

        setError(
            null
        );

    }





    function openEdit(
        user:AdminUser
    ){

        setSelectedUser(
            user
        );

        setDialogOpen(
            true
        );

        setError(
            null
        );

    }





    async function handleDelete(
        id:string
    ){

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this user?"
            );


        if(!confirmed){

            return;

        }


        try{


            setDeleting(
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
        catch(error){


            setError(
                error instanceof Error
                ? error.message
                : "Unable to delete user"
            );


        }
        finally{

            setDeleting(
                false
            );

        }

    }





    function closeDialog(){

        setDialogOpen(
            false
        );

        setSelectedUser(
            undefined
        );

    }





    return (

        <div
            className="
            space-y-6
            "
        >


            <div
                className="
                flex
                justify-between
                items-center
                "
            >


                <div>


                    <h2
                        className="
                        text-xl
                        font-semibold
                        "
                    >

                        Organization Users

                    </h2>


                    <p
                        className="
                        text-sm
                        text-muted-foreground
                        "
                    >

                        Manage identity,
                        access and user lifecycle.

                    </p>


                </div>



                <button

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

                        user={
                            selectedUser
                        }

                        onClose={closeDialog}

                    />

                )
            }



            {
                deleting && (

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

                        Deleting user...

                    </div>

                )
            }


        </div>

    );

}