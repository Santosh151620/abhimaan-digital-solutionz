"use client";

import type {
    Role,
} from "@/types/auth/role";


const ROLES: Role[] = [

    "PLATFORM_OWNER",

    "PLATFORM_ADMIN",

    "ORGANIZATION_ADMIN",

    "DEPARTMENT_ADMIN",

    "TEAM_LEAD",

    "USER",

    "VIEWER",

];


export default function RoleTable() {


    return (

        <div className="rounded-lg border p-6">

            <h2 className="mb-4 text-lg font-semibold">

                Role Management

            </h2>


            <table className="w-full text-sm">

                <thead>

                    <tr className="border-b">

                        <th className="p-2 text-left">

                            Role

                        </th>

                        <th className="p-2 text-left">

                            Status

                        </th>

                    </tr>

                </thead>


                <tbody>

                    {ROLES.map((role) => (

                        <tr
                            key={role}
                            className="border-b"
                        >

                            <td className="p-2">

                                {role}

                            </td>


                            <td className="p-2">

                                Active

                            </td>


                        </tr>

                    ))}

                </tbody>


            </table>


        </div>

    );

}
