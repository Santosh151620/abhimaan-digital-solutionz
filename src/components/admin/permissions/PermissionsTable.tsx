"use client";

import type {
    Permission,
} from "@/types/admin/Permission";



interface PermissionsTableProps {

    permissions: Permission[];

    onEdit?: (
        permission: Permission,
    ) => void;

    onDelete?: (
        id: string,
    ) => Promise<void>;

}



export default function PermissionsTable({

    permissions,

    onEdit,

    onDelete,

}: PermissionsTableProps) {



    async function handleDelete(

        permission: Permission,

    ) {

        if (!onDelete) {

            return;

        }


        const confirmed =
            window.confirm(
                `Delete permission "${permission.name}"?`,
            );


        if (!confirmed) {

            return;

        }


        try {

            await onDelete(
                permission.id,
            );

        }

        catch (error) {

            console.error(
                "Failed to delete permission:",
                error,
            );

        }

    }



    return (

        <div

            className="
                overflow-x-auto
                rounded-xl
                border
                bg-background
            "

        >

            <table

                className="
                    min-w-full
                    divide-y
                "

            >

                <thead

                    className="
                        bg-muted/30
                    "

                >

                    <tr>

                        <th className="p-3 text-left text-sm font-medium">
                            Key
                        </th>

                        <th className="p-3 text-left text-sm font-medium">
                            Name
                        </th>

                        <th className="p-3 text-left text-sm font-medium">
                            Module
                        </th>

                        <th className="p-3 text-left text-sm font-medium">
                            Action
                        </th>

                        <th className="p-3 text-left text-sm font-medium">
                            Type
                        </th>

                        <th className="p-3 text-left text-sm font-medium">
                            Status
                        </th>

                        <th className="p-3 text-right text-sm font-medium">
                            Actions
                        </th>

                    </tr>

                </thead>



                <tbody>


                    {
                        permissions.length === 0 && (

                            <tr>

                                <td

                                    colSpan={7}

                                    className="
                                        p-8
                                        text-center
                                        text-sm
                                        text-muted-foreground
                                    "

                                >

                                    No permissions found.

                                </td>

                            </tr>

                        )
                    }



                    {
                        permissions.map(

                            permission => (

                                <tr

                                    key={permission.id}

                                    className="
                                        border-t
                                        hover:bg-muted/20
                                    "

                                >

                                    <td

                                        className="
                                            p-3
                                            font-mono
                                            text-sm
                                        "

                                    >

                                        {permission.key}

                                    </td>



                                    <td className="p-3 font-medium">

                                        {permission.name}

                                    </td>



                                    <td className="p-3">

                                        {permission.module}

                                    </td>



                                    <td className="p-3">

                                        {permission.action}

                                    </td>



                                    <td className="p-3">

                                        {permission.type}

                                    </td>



                                    <td className="p-3">

                                        {
                                            permission.isActive

                                                ? "Active"

                                                : "Inactive"
                                        }

                                    </td>



                                    <td className="p-3">

                                        <div

                                            className="
                                                flex
                                                justify-end
                                                gap-2
                                            "

                                        >


                                            {
                                                onEdit && (

                                                    <button

                                                        type="button"

                                                        aria-label={`Edit ${permission.name}`}

                                                        onClick={() =>
                                                            onEdit(permission)
                                                        }

                                                        className="
                                                            rounded-md
                                                            border
                                                            px-3
                                                            py-1
                                                            text-sm
                                                        "

                                                    >

                                                        Edit

                                                    </button>

                                                )
                                            }



                                            {
                                                onDelete &&
                                                !permission.isSystem && (

                                                    <button

                                                        type="button"

                                                        aria-label={`Delete ${permission.name}`}

                                                        onClick={() =>
                                                            handleDelete(permission)
                                                        }

                                                        className="
                                                            rounded-md
                                                            border
                                                            px-3
                                                            py-1
                                                            text-sm
                                                            text-destructive
                                                        "

                                                    >

                                                        Delete

                                                    </button>

                                                )
                                            }


                                        </div>


                                    </td>


                                </tr>

                            )

                        )
                    }


                </tbody>


            </table>


        </div>

    );

}