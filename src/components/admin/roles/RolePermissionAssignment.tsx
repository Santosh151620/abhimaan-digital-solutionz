"use client";


import {
    useState,
} from "react";


import type {
    Permission,
} from "@/types/admin/Permission";


import type {
    RolePermission,
} from "@/types/admin/RolePermission";


import {
    assignRolePermission,
    revokeRolePermission,
} from "@/app/admin/(protected)/roles/actions";



interface RolePermissionAssignmentProps {


    roleId: string;


    permissions: Permission[];


    assignedPermissions: RolePermission[];


    onClose(): void;


    onSaved(): void;

}




export default function RolePermissionAssignment({

    roleId,

    permissions,

    assignedPermissions,

    onClose,

    onSaved,

}: RolePermissionAssignmentProps) {



    const [

        selectedPermissions,

        setSelectedPermissions,

    ] = useState<string[]>(

        assignedPermissions.map(

            (item) =>
                item.permissionId

        )

    );



    const [

        saving,

        setSaving,

    ] = useState(false);



    const [

        error,

        setError,

    ] = useState<string | null>(null);





    function togglePermission(

        permissionId: string,

    ) {


        setSelectedPermissions(

            (current) =>

                current.includes(permissionId)

                    ? current.filter(
                        (id) =>
                            id !== permissionId
                    )

                    : [
                        ...current,
                        permissionId,
                    ]

        );

    }







    async function savePermissions() {


        try {


            setSaving(true);

            setError(null);



            const existingIds =

                assignedPermissions.map(

                    (item) =>
                        item.permissionId

                );



            const removed =

                existingIds.filter(

                    (id) =>
                        !selectedPermissions.includes(id)

                );



            const added =

                selectedPermissions.filter(

                    (id) =>
                        !existingIds.includes(id)

                );





            for (const permissionId of removed) {


                await revokeRolePermission(

                    roleId,

                    permissionId,

                );


            }





            for (const permissionId of added) {


                await assignRolePermission(

                    roleId,

                    permissionId,

                );


            }



            onSaved();


        }

        catch (error) {


            setError(

                error instanceof Error

                    ? error.message

                    : "Unable to update permissions"

            );


        }

        finally {


            setSaving(false);


        }

    }







    return (

        <div
            className="
            space-y-6
            rounded-xl
            border
            p-6
            "
        >


            <div>

                <h2
                    className="
                    text-xl
                    font-semibold
                    "
                >

                    Role Permissions

                </h2>


                <p
                    className="
                    text-sm
                    text-muted-foreground
                    "
                >

                    Assign permissions for this role.

                </p>


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







            <div
                className="
                grid
                gap-3
                "
            >


                {
                    permissions.map(

                        (permission) => {


                            const checked =

                                selectedPermissions.includes(

                                    permission.id

                                );



                            return (

                                <label

                                    key={
                                        permission.id
                                    }

                                    className="
                                    flex
                                    items-center
                                    gap-3
                                    rounded-md
                                    border
                                    p-3
                                    "

                                >


                                    <input

                                        type="checkbox"

                                        checked={
                                            checked
                                        }

                                        onChange={() =>
                                            togglePermission(
                                                permission.id
                                            )
                                        }

                                    />



                                    <div>


                                        <div
                                            className="
                                            font-medium
                                            "
                                        >

                                            {permission.name}

                                        </div>


                                        <div
                                            className="
                                            text-sm
                                            text-muted-foreground
                                            "
                                        >

                                            {permission.description}

                                        </div>


                                    </div>


                                </label>

                            );

                        }

                    )

                }


            </div>







            <div
                className="
                flex
                justify-end
                gap-3
                "
            >


                <button

                    type="button"

                    onClick={onClose}

                    disabled={saving}

                    className="
                    rounded-md
                    border
                    px-4
                    py-2
                    "

                >

                    Cancel

                </button>





                <button

                    type="button"

                    onClick={savePermissions}

                    disabled={saving}

                    className="
                    rounded-md
                    bg-primary
                    px-4
                    py-2
                    text-primary-foreground
                    "

                >

                    {
                        saving
                            ? "Saving..."
                            : "Save Permissions"
                    }

                </button>



            </div>


        </div>

    );

}