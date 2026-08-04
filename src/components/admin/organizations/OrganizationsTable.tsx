"use client";

import type {
    Organization,
} from "@/types/admin/Organization";

interface OrganizationsTableProps {

    organizations: Organization[];

    onSelect?(
        organization: Organization,
    ): void;

    onEdit?(
        organization: Organization,
    ): void;

    onDelete?(
        id: string,
    ): void | Promise<void>;

}

export default function OrganizationsTable({

    organizations,

    onSelect,

    onEdit,

    onDelete,

}: OrganizationsTableProps) {

    return (

        <div className="overflow-x-auto rounded-xl border">

            <table className="min-w-full">

                <thead className="border-b bg-muted/40">


                    <tr>

                        <th className="p-3 text-left">
                            Name
                        </th>

                        <th className="p-3 text-left">
                            Code
                        </th>

                        <th className="p-3 text-left">
                            Status
                        </th>

                        <th className="p-3 text-left">
                            Created
                        </th>

                        <th className="p-3 text-right">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        organizations.length === 0 && (

                            <tr>

                                <td
                                    colSpan={5}
                                    className="
                                        p-6
                                        text-center
                                        text-muted-foreground
                                    "
                                >

                                    No organizations found.

                                </td>

                            </tr>

                        )

                    }

                    {

                        organizations.map(

                            organization => (

                                <tr

                                    key={
                                        organization.id
                                    }

                                    className="
                                        border-b
                                        hover:bg-muted/30
                                    "

                                >

                                    <td
                                        className="
                                            p-3
                                            font-medium
                                        "
                                    >

                                        {

                                            onSelect

                                                ? (

                                                    <button

                                                        type="button"

                                                        onClick={() =>

                                                            onSelect(

                                                                organization,

                                                            )

                                                        }

                                                        className="
                                                            text-left
                                                            hover:underline
                                                        "

                                                    >

                                                        {

                                                            organization.name

                                                        }

                                                    </button>

                                                )

                                                : (

                                                    organization.name

                                                )

                                        }

                                    </td>

                                    <td className="p-3">

                                        {

                                            organization.code

                                        }

                                    </td>

                                    <td className="p-3">

                                        {

                                            organization.status

                                        }

                                    </td>

                                    <td className="p-3">

                                        {

                                            new Date(

                                                organization.createdAt,

                                            ).toLocaleDateString()

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

                                                                organization,

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

                                                            onDelete(

                                                                organization.id,

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