"use client";

import { useState, useTransition } from "react";

import type {
    Permission,
} from "@/types/admin/Permission";

import type {
    Role,
} from "@/types/admin/Role";

import {
    replacePermissions,
} from "@/app/admin/(protected)/role-permissions/actions";

interface RolePermissionAssignmentProps {

    role: Role;

    permissions: Permission[];

    selectedPermissionIds: string[];

    onSaved?: () => void;

}

export default function RolePermissionAssignment({

    role,

    permissions,

    selectedPermissionIds,

    onSaved,

}: RolePermissionAssignmentProps) {

    const [

        selected,

        setSelected,

    ] = useState<string[]>(

        selectedPermissionIds,

    );

    const [

        pending,

        startTransition,

    ] = useTransition();

    function toggle(

        permissionId: string,

    ) {

        setSelected(

            previous =>

                previous.includes(permissionId)

                    ? previous.filter(

                        id =>

                            id !== permissionId,

                    )

                    : [

                        ...previous,

                        permissionId,

                    ],

        );

    }

    function save() {

        startTransition(

            async () => {

                await replacePermissions(

                    role.id,

                    selected,

                );

                onSaved?.();

            },

        );

    }

    return (

        <div className="rounded-xl border bg-background p-6 space-y-6">

            <div>

                <h2 className="text-xl font-semibold">

                    {role.name}

                </h2>

                <p className="text-sm text-muted-foreground">

                    Assign permissions to this role.

                </p>

            </div>

            <div className="max-h-[500px] overflow-y-auto rounded-md border">

                <table className="min-w-full">

                    <thead>

                        <tr className="border-b bg-muted/40">

                            <th className="w-14 p-3"></th>

                            <th className="p-3 text-left">

                                Permission

                            </th>

                            <th className="p-3 text-left">

                                Module

                            </th>

                            <th className="p-3 text-left">

                                Action

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {permissions.map(

                            permission => (

                                <tr

                                    key={permission.id}

                                    className="border-b"

                                >

                                    <td className="p-3">

                                        <input

                                            type="checkbox"

                                            checked={

                                                selected.includes(

                                                    permission.id,

                                                )

                                            }

                                            onChange={() =>

                                                toggle(

                                                    permission.id,

                                                )

                                            }

                                        />

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

                                </tr>

                            ),

                        )}

                    </tbody>

                </table>

            </div>

            <div className="flex justify-end">

                <button

                    type="button"

                    disabled={pending}

                    onClick={save}

                    className="rounded-md bg-primary px-5 py-2 text-primary-foreground"

                >

                    {pending

                        ? "Saving..."

                        : "Save Permissions"}

                </button>

            </div>

        </div>

    );

}