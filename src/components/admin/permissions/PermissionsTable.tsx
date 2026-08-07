"use client";


import type {
    Permission,
} from "@/types/admin/Permission";







interface PermissionsTableProps {



    permissions:Permission[];





    onEdit?:

        (

            permission:Permission,

        ) => void;





    onDelete?:

        (

            id:string,

        ) => Promise<void>;



}









export default function PermissionsTable({



    permissions,



    onEdit,



    onDelete,



}:PermissionsTableProps) {



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

                            Key

                        </th>



                        <th className="p-3 text-left font-medium">

                            Name

                        </th>



                        <th className="p-3 text-left font-medium">

                            Module

                        </th>



                        <th className="p-3 text-left font-medium">

                            Action

                        </th>



                        <th className="p-3 text-left font-medium">

                            Type

                        </th>



                        <th className="p-3 text-left font-medium">

                            Status

                        </th>



                        <th className="p-3 text-right font-medium">

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









                                    <td className="p-3">



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



                                                        onClick={() =>

                                                            onEdit(

                                                                permission,

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

                                                !permission.isSystem && (

<button

    type="button"

    onClick={() => {

        if (

            window.confirm(

                `Delete permission "${permission.name}"?`

            )

        ) {

            void onDelete(

                permission.id,

            );

        }

    }}

    className="

        rounded-md

        border

        px-3

        py-1

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