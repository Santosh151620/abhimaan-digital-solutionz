"use client";

import type {
    Permission,
} from "@/types/admin/Permission";


interface PermissionsTableProps {

    permissions: Permission[];

}


export default function PermissionsTable({

    permissions,

}: PermissionsTableProps) {


    return (

        <div className="overflow-x-auto rounded-xl border">


            <table className="min-w-full">


                <thead>

                    <tr className="border-b bg-muted/30">

                        <th className="p-3 text-left">
                            Name
                        </th>


                        <th className="p-3 text-left">
                            Module
                        </th>


                        <th className="p-3 text-left">
                            Resource
                        </th>


                        <th className="p-3 text-left">
                            Action
                        </th>


                        <th className="p-3 text-left">
                            Scope
                        </th>


                        <th className="p-3 text-left">
                            Status
                        </th>


                    </tr>


                </thead>



                <tbody>


                    {permissions.length === 0 && (

                        <tr>

                            <td

                                colSpan={6}

                                className="p-6 text-center text-muted-foreground"

                            >

                                No permissions found.

                            </td>

                        </tr>

                    )}



                    {permissions.map(permission => (


                        <tr

                            key={permission.id}

                            className="border-b"

                        >


                            <td className="p-3 font-medium">

                                {permission.name}

                            </td>


                            <td className="p-3">

                                {permission.module}

                            </td>


                            <td className="p-3">

                                {permission.resource}

                            </td>


                            <td className="p-3">

                                {permission.action}

                            </td>


                            <td className="p-3">

                                {permission.scope}

                            </td>


                            <td className="p-3">

                                {permission.isActive
                                    ? "Active"
                                    : "Inactive"}

                            </td>


                        </tr>


                    ))}


                </tbody>


            </table>


        </div>

    );

}
