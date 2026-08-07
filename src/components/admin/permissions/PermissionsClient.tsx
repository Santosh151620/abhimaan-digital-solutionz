"use client";


import {
    useState,
} from "react";


import {
    useRouter,
} from "next/navigation";


import type {
    Permission,
} from "@/types/admin/Permission";


import PermissionsTable
from "./PermissionsTable";


import PermissionDialog
from "./PermissionDialog";


import {
    deletePermission,
} from "@/app/admin/(protected)/permissions/actions";









interface PermissionsClientProps {



    initialPermissions:Permission[];



}









export default function PermissionsClient({



    initialPermissions,



}:PermissionsClientProps) {



    const router =

        useRouter();







    const [

        permissions,

        setPermissions,

    ] = useState<Permission[]>(

        initialPermissions,

    );







    const [

        selectedPermission,

        setSelectedPermission,

    ] = useState<Permission | undefined>();







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



        setSelectedPermission(

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

        permission:Permission,

    ) {



        setSelectedPermission(

            permission,

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



        setSelectedPermission(

            undefined,

        );



    }


async function handleDelete(

    id:string,

) {

    try {

        setLoading(true);

        setError(null);

        await deletePermission(

            id,

        );

        setPermissions(

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

                : "Unable to delete permission.",

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



                        Permission Registry



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



                    Add Permission



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









            <PermissionsTable



                permissions={permissions}



                onEdit={openEdit}



                onDelete={handleDelete}



            />









            {

                dialogOpen && (



                    <PermissionDialog



                        permission={selectedPermission}



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