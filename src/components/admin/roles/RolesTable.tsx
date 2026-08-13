"use client";

import type {
    Role,
} from "@/types/admin/Role";


interface RolesTableProps {

    roles: Role[];

    onEdit?: (
        role: Role,
    ) => void;

    onDelete?: (
        id: string,
    ) => Promise<void>;

}



export default function RolesTable({

    roles,

    onEdit,

    onDelete,

}: RolesTableProps) {


    async function handleDelete(

        role: Role,

    ) {

        if (!onDelete) {

            return;

        }


        const confirmed =
            window.confirm(
                `Delete role "${role.name}"?`,
            );


        if (!confirmed) {

            return;

        }


        try {

            await onDelete(
                role.id,
            );

        }

        catch (error) {

            console.error(
                "Failed to delete role:",
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
                            Name
                        </th>


                        <th className="p-3 text-left text-sm font-medium">
                            Code
                        </th>


                        <th className="p-3 text-left text-sm font-medium">
                            Type
                        </th>


                        <th className="p-3 text-left text-sm font-medium">
                            Level
                        </th>


                        <th className="p-3 text-left text-sm font-medium">
                            Status
                        </th>


                        <th className="p-3 text-left text-sm font-medium">
                            System
                        </th>


                        <th className="p-3 text-right text-sm font-medium">
                            Actions
                        </th>


                    </tr>

                </thead>



                <tbody>


                    {
                        roles.length === 0 && (

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

                                    No roles found.

                                </td>


                            </tr>

                        )
                    }



                    {
                        roles.map(

                            role => (

                                <tr

                                    key={role.id}

                                    className="
                                        border-t
                                        hover:bg-muted/20
                                    "

                                >

                                    <td className="p-3 font-medium">

                                        {role.name}

                                    </td>



                                    <td

                                        className="
                                            p-3
                                            font-mono
                                            text-sm
                                        "

                                    >

                                        {role.code}

                                    </td>



                                    <td className="p-3">

                                        {role.type}

                                    </td>



                                    <td className="p-3">

                                        {role.level}

                                    </td>



                                    <td className="p-3">

                                        {role.status}

                                    </td>



                                    <td className="p-3">

                                        {
                                            role.isSystem
                                                ? "Yes"
                                                : "No"
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

                                                        aria-label={`Edit ${role.name}`}

                                                        onClick={() =>
                                                            onEdit(role)
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
                                                !role.isSystem && (

                                                    <button

                                                        type="button"

                                                        aria-label={`Delete ${role.name}`}

                                                        onClick={() =>
                                                            handleDelete(role)
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