"use client";

import {
    useState,
    useTransition,
} from "react";

import type {
    Role,
} from "@/types/admin/Role";

import {
    replaceRoles,
    setPrimaryRole,
} from "@/app/admin/(protected)/users/UserActions";

interface UserRoleAssignmentProps {

    userId: string;

    roles: Role[];

    selectedRoleIds: string[];

    primaryRoleId?: string;

    onSaved?: () => void;

}

export default function UserRoleAssignment({

    userId,

    roles,

    selectedRoleIds,

    primaryRoleId,

    onSaved,

}: UserRoleAssignmentProps) {

    const [

        selected,

        setSelected,

    ] = useState<string[]>(

        selectedRoleIds,

    );

    const [

        primary,

        setPrimary,

    ] = useState(

        primaryRoleId ??
        selectedRoleIds[0] ??
        "",

    );

    const [

        pending,

        startTransition,

    ] = useTransition();

    function toggle(
        roleId: string,
    ) {

        setSelected(

            previous =>

                previous.includes(roleId)

                    ? previous.filter(

                        id =>

                            id !== roleId,

                    )

                    : [

                        ...previous,

                        roleId,

                    ],

        );

    }

    function save() {

        startTransition(

            async () => {

                await replaceRoles(

                    userId,

                    selected,

                );

                if (

                    primary &&
                    selected.includes(primary)

                ) {

                    await setPrimaryRole(

                        userId,

                        primary,

                    );

                }

                onSaved?.();

            },

        );

    }

    return (

        <div className="rounded-xl border bg-background p-6 space-y-6">

            <div>

                <h2 className="text-xl font-semibold">

                    User Roles

                </h2>

                <p className="text-sm text-muted-foreground">

                    Assign one or more roles. Select one primary role.

                </p>

            </div>

            <div className="max-h-[500px] overflow-y-auto rounded-md border">

                <table className="min-w-full">

                    <thead>

                        <tr className="border-b bg-muted/40">

                            <th className="w-14 p-3">

                                Assigned

                            </th>

                            <th className="w-20 p-3">

                                Primary

                            </th>

                            <th className="p-3 text-left">

                                Role

                            </th>

                            <th className="p-3 text-left">

                                Code

                            </th>

                            <th className="p-3 text-left">

                                Type

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            roles.map(

                                role => (

                                    <tr

                                        key={role.id}

                                        className="border-b"

                                    >

                                        <td className="p-3">

                                            <input

                                                type="checkbox"

                                                checked={

                                                    selected.includes(

                                                        role.id,

                                                    )

                                                }

                                                onChange={() =>

                                                    toggle(

                                                        role.id,

                                                    )

                                                }

                                            />

                                        </td>

                                        <td className="p-3">

                                            <input

                                                type="radio"

                                                name="primaryRole"

                                                checked={

                                                    primary === role.id

                                                }

                                                disabled={

                                                    !selected.includes(

                                                        role.id,

                                                    )

                                                }

                                                onChange={() =>

                                                    setPrimary(

                                                        role.id,

                                                    )

                                                }

                                            />

                                        </td>

                                        <td className="p-3 font-medium">

                                            {role.name}

                                        </td>

                                        <td className="p-3">

                                            {role.code}

                                        </td>

                                        <td className="p-3">

                                            {role.type}

                                        </td>

                                    </tr>

                                ),

                            )

                        }

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

                    {

                        pending

                            ? "Saving..."

                            : "Save Roles"

                    }

                </button>

            </div>

        </div>

    );

}