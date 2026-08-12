"use client";


import type {
    Team,
} from "@/types/admin/Team";



interface TeamTableProps {

    items: Team[];

    onEdit?: (
        team: Team,
    ) => void;

    onDelete?: (
        team: Team,
    ) => void;

}



function StatusBadge({

    status,

}: {

    status: Team["status"];

}) {


    const active =
        status === "Active";



    return (

        <span
            className={`
                inline-flex
                rounded-full
                px-2.5
                py-1
                text-xs
                font-medium
                ${
                    active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                }
            `}
        >

            {
                status
            }

        </span>

    );

}




export default function TeamTable({

    items,

    onEdit,

    onDelete,

}: TeamTableProps) {



    if (!items.length) {


        return (

            <div
                className="
                    rounded-xl
                    border
                    border-border
                    bg-background
                    p-8
                    text-center
                    text-sm
                    text-muted-foreground
                "
            >

                No teams found.

            </div>

        );

    }



    return (

        <div
            className="
                overflow-x-auto
                rounded-xl
                border
                border-border
            "
        >

            <table
                className="
                    min-w-full
                    divide-y
                    divide-border
                "
            >


                <thead
                    className="
                        bg-muted/40
                    "
                >

                    <tr>


                        <th
                            className="
                                px-4
                                py-3
                                text-left
                                text-sm
                                font-semibold
                            "
                        >
                            Code
                        </th>



                        <th
                            className="
                                px-4
                                py-3
                                text-left
                                text-sm
                                font-semibold
                            "
                        >
                            Team
                        </th>



                        <th
                            className="
                                px-4
                                py-3
                                text-left
                                text-sm
                                font-semibold
                            "
                        >
                            Department
                        </th>



                        <th
                            className="
                                px-4
                                py-3
                                text-left
                                text-sm
                                font-semibold
                            "
                        >
                            Status
                        </th>



                        <th
                            className="
                                px-4
                                py-3
                                text-right
                                text-sm
                                font-semibold
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
                        items.map(

                            team => (

                                <tr
                                    key={
                                        team.id
                                    }
                                >



                                    <td
                                        className="
                                            whitespace-nowrap
                                            px-4
                                            py-3
                                            text-sm
                                        "
                                    >
                                        {
                                            team.teamCode
                                        }
                                    </td>




                                    <td
                                        className="
                                            px-4
                                            py-3
                                        "
                                    >

                                        <div
                                            className="
                                                font-medium
                                                text-foreground
                                            "
                                        >

                                            {
                                                team.teamName
                                            }

                                        </div>



                                        {
                                            team.description && (

                                                <div
                                                    className="
                                                        mt-1
                                                        text-sm
                                                        text-muted-foreground
                                                    "
                                                >

                                                    {
                                                        team.description
                                                    }

                                                </div>

                                            )
                                        }


                                    </td>




                                    <td
                                        className="
                                            px-4
                                            py-3
                                            text-sm
                                        "
                                    >

                                        {
                                            team.departmentId ?? "-"
                                        }

                                    </td>




                                    <td
                                        className="
                                            px-4
                                            py-3
                                        "
                                    >

                                        <StatusBadge

                                            status={
                                                team.status
                                            }

                                        />

                                    </td>




                                    <td
                                        className="
                                            px-4
                                            py-3
                                        "
                                    >

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
                                                                team,
                                                            )
                                                        }

                                                        className="
                                                            rounded-md
                                                            border
                                                            px-3
                                                            py-1.5
                                                            text-sm
                                                            hover:bg-muted
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
                                                                team,
                                                            )
                                                        }

                                                        className="
                                                            rounded-md
                                                            border
                                                            border-red-300
                                                            px-3
                                                            py-1.5
                                                            text-sm
                                                            text-red-600
                                                            hover:bg-red-50
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