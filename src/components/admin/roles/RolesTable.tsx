"use client";

import type {
    Role,
} from "@/types/admin/Role";


interface RolesTableProps {

    roles: Role[];

    onEdit?:(
        role: Role
    )=>void;

    onDelete?:(
        id:string
    )=>Promise<void>;

}


export default function RolesTable({

    roles,

    onEdit,

    onDelete,

}:RolesTableProps){


    return (

        <div className="overflow-x-auto rounded-xl border">


            <table className="min-w-full">


                <thead>

                    <tr className="border-b bg-muted/30">

                        <th className="p-3 text-left">
                            Name
                        </th>


                        <th className="p-3 text-left">
                            Code
                        </th>


                        <th className="p-3 text-left">
                            Level
                        </th>


                        <th className="p-3 text-left">
                            Status
                        </th>


                        <th className="p-3 text-right">
                            Actions
                        </th>


                    </tr>

                </thead>


                <tbody>


                    {roles.map(role=>(


                        <tr
                            key={role.id}
                            className="border-b"
                        >

                            <td className="p-3 font-medium">
                                {role.name}
                            </td>


                            <td className="p-3">
                                {role.code}
                            </td>


                            <td className="p-3">
                                {role.level}
                            </td>


                            <td className="p-3">
                                {role.status}
                            </td>


                            <td className="p-3 text-right">


                                <div className="flex justify-end gap-2">


                                    {onEdit && (

                                        <button

                                            onClick={()=>
                                                onEdit(role)
                                            }

                                            className="rounded border px-3 py-1"

                                        >

                                            Edit

                                        </button>

                                    )}



                                    {onDelete && (

                                        <button

                                            onClick={()=>
                                                onDelete(role.id)
                                            }

                                            className="rounded border px-3 py-1 text-destructive"

                                        >

                                            Delete

                                        </button>

                                    )}


                                </div>


                            </td>


                        </tr>


                    ))}


                </tbody>


            </table>


        </div>

    );

}
