/**
 * ============================================================================
 * ADS ENTERPRISE PLATFORM
 *
 * User Role Administration
 *
 * Responsibilities:
 * - Select user
 * - View assigned roles
 * - Manage RBAC assignments
 *
 * Architecture:
 *
 * Page
 *   ↓
 * Users Repository
 * UserRole Actions
 *   ↓
 * UserRole Service
 *   ↓
 * UserRole Repository
 *
 * ============================================================================
 */

import {
    getUserRoles,
} from "./actions";


import {
    UsersRepository,
} from "@/repositories/admin/UsersRepository";


import {
    createClient,
} from "@/lib/supabase/server";



export default async function UserRolesPage() {


    const supabase =
        await createClient();


    const usersRepository =
        new UsersRepository(
            supabase,
        );


    const users =
        await usersRepository.list();



    const selectedUser =
        users[0] ?? null;



    const roles =
        selectedUser
            ? await getUserRoles(
                selectedUser.id,
            )
            : [];



    return (

        <div className="space-y-6">


            <div>

                <h1 className="text-2xl font-semibold">
                    User Roles
                </h1>


                <p className="text-sm text-muted-foreground">
                    Manage role assignments for users.
                </p>

            </div>



            <div className="rounded-lg border p-4">


                <h2 className="font-medium mb-4">
                    Users
                </h2>


                {
                    users.length === 0 ? (

                        <p className="text-sm text-muted-foreground">
                            No users available.
                        </p>

                    ) : (

                        <div className="space-y-2">

                            {
                                users.map(
                                    user => (

                                        <div
                                            key={user.id}
                                            className="rounded border p-3"
                                        >

                                            <div className="font-medium">
                                                {user.fullName}
                                            </div>


                                            <div className="text-sm text-muted-foreground">
                                                {user.email}
                                            </div>


                                            {
                                                selectedUser?.id === user.id && (

                                                    <div className="mt-3">

                                                        <div className="font-medium">
                                                            Assigned Roles
                                                        </div>


                                                        {
                                                            roles.length === 0 ? (

                                                                <p className="text-sm text-muted-foreground">
                                                                    No roles assigned.
                                                                </p>

                                                            ) : (

                                                                <ul className="mt-2 list-disc pl-5">

                                                                    {
                                                                        roles.map(
                                                                            role => (

                                                                                <li
                                                                                    key={role.id}
                                                                                >
                                                                                    {role.roleId}
                                                                                </li>

                                                                            )
                                                                        )
                                                                    }

                                                                </ul>

                                                            )
                                                        }

                                                    </div>

                                                )
                                            }


                                        </div>

                                    )
                                )
                            }

                        </div>

                    )
                }


            </div>


        </div>

    );

}