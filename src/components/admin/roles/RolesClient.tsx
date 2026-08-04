"use client";


import {
    useState,
} from "react";


import {
    useRouter,
} from "next/navigation";


import type {
    Role,
} from "@/types/admin/Role";


import type {
    Permission,
} from "@/types/admin/Permission";


import type {
    RolePermission,
} from "@/types/admin/RolePermission";


import RolesTable
from "./RolesTable";


import RolePermissionAssignment
from "./RolePermissionAssignment";


import RoleDialog
from "./RoleDialog";



interface RolesClientProps {

    roles: Role[];

    permissions: Permission[];

    rolePermissions: RolePermission[];

}



export default function RolesClient({

    roles,

    permissions,

    rolePermissions,

}: RolesClientProps) {


    const router =
        useRouter();



    const [
        selectedRole,
        setSelectedRole,
    ] =
    useState<Role | null>(null);



    const [
        permissionOpen,
        setPermissionOpen,
    ] =
    useState(false);




    function openPermissions(
        role: Role,
    ) {

        setSelectedRole(
            role,
        );

        setPermissionOpen(
            true,
        );

    }





    function closePermissions() {

        setSelectedRole(
            null,
        );

        setPermissionOpen(
            false,
        );

    }




    function saved() {

        closePermissions();

        router.refresh();

    }




    return (

        <div className="space-y-8">


            <section
                className="
                flex
                items-center
                justify-between
                "
            >

                <div>

                    <h1 className="text-3xl font-bold">
                        Roles
                    </h1>


                    <p className="text-muted-foreground">
                        Manage platform and organization roles.
                    </p>


                </div>


                <RoleDialog />


            </section>




            <RolesTable

                roles={roles}

                onEdit={() => {}}

                onManagePermissions={
                    openPermissions
                }

            />





            {
                permissionOpen &&
                selectedRole && (

                    <RolePermissionAssignment

                        roleId={
                            selectedRole.id
                        }


                        permissions={
                            permissions
                        }


                        assignedPermissions={
                            rolePermissions.filter(

                                (item) =>
                                    item.roleId === selectedRole.id

                            )
                        }


                        onClose={
                            closePermissions
                        }


                        onSaved={
                            saved
                        }

                    />

                )
            }


        </div>

    );

}