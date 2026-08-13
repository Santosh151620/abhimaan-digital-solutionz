"use client";


import {
    useState,
} from "react";


import {
    useRouter,
} from "next/navigation";


import type {
    Role,
} from "@/types/admin/Role";


import RolesTable
    from "./RolesTable";


import RoleDialog
    from "./RoleDialog";


import {
    deleteRole,
} from "@/app/admin/(protected)/roles/actions";



interface RolesClientProps {

    initialRoles: Role[];

}



export default function RolesClient({

    initialRoles,

}: RolesClientProps) {


    const router =
        useRouter();



    const [
        roles,
        setRoles,
    ] = useState<Role[]>(
        initialRoles,
    );



    const [
        selectedRole,
        setSelectedRole,
    ] = useState<Role | undefined>();



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


        if (loading) {

            return;

        }



        setSelectedRole(
            undefined,
        );


        setError(
            null,
        );


        setDialogOpen(
            true,
        );

    }



    function openEdit(

        role: Role,

    ) {


        if (loading) {

            return;

        }



        setSelectedRole(
            role,
        );


        setError(
            null,
        );


        setDialogOpen(
            true,
        );

    }



    function closeDialog() {


        if (loading) {

            return;

        }



        setDialogOpen(
            false,
        );


        setSelectedRole(
            undefined,
        );


        setError(
            null,
        );

    }



    async function handleDelete(

        id: string,

    ) {


        if (loading) {

            return;

        }



        const role =
            roles.find(

                item =>
                    item.id === id,

            );



        if (!role) {

            setError(
                "Role not found.",
            );

            return;

        }



        if (role.isSystem) {

            setError(
                "System roles cannot be deleted.",
            );

            return;

        }



        const confirmed =
            window.confirm(

                `Delete role "${role.name}"? This action cannot be undone.`,

            );



        if (!confirmed) {

            return;

        }



        try {


            setLoading(
                true,
            );


            setError(
                null,
            );


            await deleteRole(
                id,
            );


            setRoles(

                previous =>
                    previous.filter(

                        item =>
                            item.id !== id,

                    ),

            );


            if (
                selectedRole?.id === id
            ) {


                setSelectedRole(
                    undefined,
                );


                setDialogOpen(
                    false,
                );

            }



            router.refresh();

        }

        catch (caughtError) {


            setError(

                caughtError instanceof Error

                    ? caughtError.message

                    : "Unable to delete role.",

            );

        }

        finally {


            setLoading(
                false,
            );

        }

    }



    return (

        <div className="space-y-6">


            <div className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">


                <div>

                    <h2 className="
                        text-xl
                        font-semibold
                        text-foreground
                    ">

                        Role Registry

                    </h2>


                    <p className="
                        mt-1
                        text-sm
                        text-muted-foreground
                    ">

                        Manage organization roles and access levels.

                    </p>

                </div>



                <button

                    type="button"

                    onClick={openCreate}

                    disabled={loading}

                    className="
                        inline-flex
                        items-center
                        justify-center
                        rounded-lg
                        bg-primary
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-primary-foreground
                        transition
                        hover:opacity-90
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "

                >

                    Add Role

                </button>

            </div>



            {
                error && (

                    <div

                        role="alert"

                        className="
                            flex
                            items-start
                            justify-between
                            gap-4
                            rounded-lg
                            border
                            border-destructive/30
                            bg-destructive/10
                            p-3
                            text-sm
                            text-destructive
                        "

                    >

                        <span>
                            {error}
                        </span>


                        <button

                            type="button"

                            onClick={() =>
                                setError(null)
                            }

                            className="
                                shrink-0
                                font-medium
                                underline
                                underline-offset-2
                            "

                        >

                            Dismiss

                        </button>

                    </div>

                )
            }



            <RolesTable

                roles={roles}

                onEdit={openEdit}

                onDelete={handleDelete}

            />



            {
                dialogOpen && (

                    <RoleDialog

                        role={selectedRole}

                        onClose={closeDialog}

                    />

                )
            }



            {
                loading && (

                    <div

                        role="status"

                        aria-live="polite"

                        className="
                            fixed
                            bottom-6
                            right-6
                            z-50
                            rounded-lg
                            border
                            border-border
                            bg-background
                            px-4
                            py-3
                            text-sm
                            font-medium
                            text-foreground
                            shadow-lg
                        "

                    >

                        Processing...

                    </div>

                )
            }

        </div>

    );

}