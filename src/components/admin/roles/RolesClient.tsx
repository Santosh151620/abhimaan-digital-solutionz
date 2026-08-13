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



        setSelectedRole(

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

        role: Role,

    ) {



        setSelectedRole(

            role,

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



        setSelectedRole(

            undefined,

        );



    }









    async function handleDelete(

        id: string,

    ) {

        try {



            setLoading(true);



            setError(null);







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







            router.refresh();



        }

        catch (error) {



            setError(



                error instanceof Error

                    ? error.message

                    : "Unable to delete role."



            );



        }

        finally {



            setLoading(false);



        }



    }









    return (



        <div

            className="space-y-6"

        >



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



                        Role Registry



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



                    Add Role



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









            <RolesTable



                roles={roles}



                onEdit={openEdit}



                onDelete={handleDelete}



            />









            {

                dialogOpen && (
                    <RoleDialog
                        role={selectedRole}
                        onClose={() => {

                            closeDialog();

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