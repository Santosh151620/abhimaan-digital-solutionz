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

    ): Promise<void> {

        if (!onDelete || role.isSystem) {

            return;

        }


        const confirmed =
            window.confirm(
                `Delete role "${role.name}"?\n\nThis action cannot be undone.`,
            );


        if (!confirmed) {

            return;

        }


        await onDelete(
            role.id,
        );

    }


    function statusClass(

        status: Role["status"],

    ): string {

        switch (status) {

            case "Active":

                return `
                    border-green-500/20
                    bg-green-500/10
                    text-green-700
                    dark:text-green-400
                `;

            case "Inactive":

                return `
                    border-border
                    bg-muted
                    text-muted-foreground
                `;

            case "Suspended":

                return `
                    border-yellow-500/20
                    bg-yellow-500/10
                    text-yellow-700
                    dark:text-yellow-400
                `;

            case "Archived":

                return `
                    border-red-500/20
                    bg-red-500/10
                    text-red-700
                    dark:text-red-400
                `;

            default:

                return `
                    border-border
                    bg-muted
                    text-muted-foreground
                `;

        }

    }


    if (roles.length === 0) {

        return (

            <div
                className="
                    rounded-xl
                    border
                    border-border
                    bg-background
                    p-10
                    text-center
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-md
                        space-y-2
                    "
                >

                    <h3
                        className="
                            text-base
                            font-semibold
                            text-foreground
                        "
                    >

                        No roles found

                    </h3>


                    <p
                        className="
                            text-sm
                            text-muted-foreground
                        "
                    >

                        Create a role to begin configuring
                        organization access.

                    </p>

                </div>

            </div>

        );

    }


    return (

        <div
            className="
                overflow-hidden
                rounded-xl
                border
                border-border
                bg-background
            "
        >

            <div
                className="
                    overflow-x-auto
                "
            >

                <table
                    className="
                        min-w-[900px]
                        w-full
                        divide-y
                        divide-border
                    "
                >

                    <thead
                        className="
                            bg-muted/30
                        "
                    >

                        <tr>

                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-muted-foreground
                                "
                            >

                                Name

                            </th>


                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-muted-foreground
                                "
                            >

                                Code

                            </th>


                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-muted-foreground
                                "
                            >

                                Type

                            </th>


                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-muted-foreground
                                "
                            >

                                Level

                            </th>


                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-muted-foreground
                                "
                            >

                                Status

                            </th>


                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-muted-foreground
                                "
                            >

                                System

                            </th>


                            <th
                                scope="col"
                                className="
                                    whitespace-nowrap
                                    px-4
                                    py-3
                                    text-right
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-muted-foreground
                                "
                            >

                                Actions

                            </th>

                        </tr>

                    </thead>


                    <tbody
                        className="
                            divide-y
                            divide-border
                        "
                    >

                        {
                            roles.map(

                                role => (

                                    <tr
                                        key={role.id}
                                        className="
                                            transition-colors
                                            hover:bg-muted/20
                                        "
                                    >

                                        <td
                                            className="
                                                px-4
                                                py-4
                                            "
                                        >

                                            <div
                                                className="
                                                    min-w-48
                                                "
                                            >

                                                <p
                                                    className="
                                                        font-medium
                                                        text-foreground
                                                    "
                                                >

                                                    {role.name}

                                                </p>


                                                {
                                                    role.description && (

                                                        <p
                                                            className="
                                                                mt-1
                                                                max-w-md
                                                                truncate
                                                                text-xs
                                                                text-muted-foreground
                                                            "
                                                            title={
                                                                role.description
                                                            }
                                                        >

                                                            {
                                                                role.description
                                                            }

                                                        </p>

                                                    )
                                                }

                                            </div>

                                        </td>


                                        <td
                                            className="
                                                px-4
                                                py-4
                                            "
                                        >

                                            <code
                                                className="
                                                    rounded
                                                    bg-muted
                                                    px-2
                                                    py-1
                                                    text-xs
                                                    text-foreground
                                                "
                                            >

                                                {role.code}

                                            </code>

                                        </td>


                                        <td
                                            className="
                                                whitespace-nowrap
                                                px-4
                                                py-4
                                                text-sm
                                                text-foreground
                                            "
                                        >

                                            {role.type}

                                        </td>


                                        <td
                                            className="
                                                whitespace-nowrap
                                                px-4
                                                py-4
                                                text-sm
                                                text-foreground
                                            "
                                        >

                                            {role.level}

                                        </td>


                                        <td
                                            className="
                                                px-4
                                                py-4
                                            "
                                        >

                                            <span
                                                className={`
                                                    inline-flex
                                                    items-center
                                                    rounded-full
                                                    border
                                                    px-2.5
                                                    py-1
                                                    text-xs
                                                    font-medium
                                                    ${statusClass(
                                                        role.status,
                                                    )}
                                                `}
                                            >

                                                {role.status}

                                            </span>

                                        </td>


                                        <td
                                            className="
                                                px-4
                                                py-4
                                            "
                                        >

                                            {
                                                role.isSystem
                                                    ? (

                                                        <span
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                rounded-full
                                                                border
                                                                border-primary/20
                                                                bg-primary/10
                                                                px-2.5
                                                                py-1
                                                                text-xs
                                                                font-medium
                                                                text-primary
                                                            "
                                                        >

                                                            System

                                                        </span>

                                                    )
                                                    : (

                                                        <span
                                                            className="
                                                                text-sm
                                                                text-muted-foreground
                                                            "
                                                        >

                                                            No

                                                        </span>

                                                    )
                                            }

                                        </td>


                                        <td
                                            className="
                                                px-4
                                                py-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
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
                                                            aria-label={
                                                                `Edit role ${role.name}`
                                                            }
                                                            className="
                                                                rounded-lg
                                                                border
                                                                border-border
                                                                px-3
                                                                py-1.5
                                                                text-sm
                                                                font-medium
                                                                text-foreground
                                                                transition
                                                                hover:bg-muted
                                                                focus:outline-none
                                                                focus:ring-2
                                                                focus:ring-primary/30
                                                            "
                                                        >

                                                            Edit

                                                        </button>

                                                    )
                                                }


                                                {
                                                    onDelete && (
                                                        role.isSystem
                                                            ? (

                                                                <span
                                                                    className="
                                                                        px-3
                                                                        py-1.5
                                                                        text-xs
                                                                        text-muted-foreground
                                                                    "
                                                                    title="
                                                                        System roles cannot be deleted
                                                                    "
                                                                >

                                                                    Protected

                                                                </span>

                                                            )
                                                            : (

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        void handleDelete(
                                                                            role,
                                                                        )
                                                                    }
                                                                    aria-label={
                                                                        `Delete role ${role.name}`
                                                                    }
                                                                    className="
                                                                        rounded-lg
                                                                        border
                                                                        border-destructive/30
                                                                        px-3
                                                                        py-1.5
                                                                        text-sm
                                                                        font-medium
                                                                        text-destructive
                                                                        transition
                                                                        hover:bg-destructive/10
                                                                        focus:outline-none
                                                                        focus:ring-2
                                                                        focus:ring-destructive/30
                                                                    "
                                                                >

                                                                    Delete

                                                                </button>

                                                            )
                                                    )
                                                }

                                            </div>

                                        </td>

                                    </tr>

                                ),

                            )
                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}