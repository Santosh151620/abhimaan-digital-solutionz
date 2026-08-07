"use client";


import type {
    Role,
} from "@/types/admin/Role";







interface RolesTableProps {



    roles: Role[];





    onEdit?:

    (

        role: Role,

    ) => void;





    onDelete?:

    (

        id: string,

    ) => Promise<void>;



}









export default function RolesTable({



    roles,



    onEdit,



    onDelete,



}: RolesTableProps) {



    return (



        <div

            className="

                overflow-x-auto

                rounded-xl

                border

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



                        <th className="p-3 text-left font-medium">

                            Name

                        </th>



                        <th className="p-3 text-left font-medium">

                            Code

                        </th>



                        <th className="p-3 text-left font-medium">

                            Type

                        </th>



                        <th className="p-3 text-left font-medium">

                            Level

                        </th>



                        <th className="p-3 text-left font-medium">

                            Status

                        </th>



                        <th className="p-3 text-left font-medium">

                            System

                        </th>



                        <th className="p-3 text-right font-medium">

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
                                    <td
                                        className="
                                            p-3
                                            font-medium
                                        "
                                    >
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
                                                        onClick={() =>
                                                            onEdit(
                                                                role,
                                                            )
                                                        }



                                                        className="

                                                            rounded-md

                                                            border

                                                            px-3

                                                            py-1

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
    disabled={!onDelete}
    onClick={async () => {

        if (!onDelete) {

            return;

        }

        const confirmed = window.confirm(
            `Delete role "${role.name}"?`
        );

        if (!confirmed) {

            return;

        }

        await onDelete(
            role.id,
        );

    }}
    className="
        rounded-md
        border
        px-3
        py-1
        text-destructive
        disabled:cursor-not-allowed
        disabled:opacity-50
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
