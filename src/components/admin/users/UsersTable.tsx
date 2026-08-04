"use client";

import type {
    AdminUser,
} from "@/types/admin/User";

interface UsersTableProps {

    users: AdminUser[];

    onEdit?: (
        user: AdminUser,
    ) => void;

    onDelete?: (
        id: string,
    ) => Promise<void>;

}

export default function UsersTable({

    users,

    onEdit,

    onDelete,

}: UsersTableProps) {

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
                            Email
                        </th>

                        <th className="p-3 text-left font-medium">
                            User Type
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

                        users.length === 0 && (

                            <tr>

                                <td
                                    colSpan={5}
                                    className="
                                    p-8
                                    text-center
                                    text-muted-foreground
                                    "
                                >

                                    No users found.

                                </td>

                            </tr>

                        )

                    }

                    {

                        users.map(

                            user => (

                                <tr
                                    key={user.id}
                                    className="
                                    border-t
                                    hover:bg-muted/20
                                    "
                                >

                                    <td className="p-3 font-medium">
                                        {user.fullName}
                                    </td>

                                    <td className="p-3">
                                        {user.email}
                                    </td>

                                    <td className="p-3">
                                        {user.userType}
                                    </td>

                                    <td className="p-3">
                                        {user.status}
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
                                                                user,
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

                                                onDelete && (

                                                    <button

                                                        type="button"

                                                        onClick={() =>
                                                            void onDelete(
                                                                user.id,
                                                            )
                                                        }

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

                            ),

                        )

                    }

                </tbody>

            </table>

        </div>

    );

}