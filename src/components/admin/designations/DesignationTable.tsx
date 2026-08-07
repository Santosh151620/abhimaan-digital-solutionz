"use client";

import type {
    Designation,
} from "@/types/admin/Designation";

interface DesignationTableProps {

    items:Designation[];

    onEdit?(
        designation:Designation,
    ):void;

    onDelete?(
        designation:Designation,
    ):void;

}

export default function DesignationTable({

    items,

    onEdit,

    onDelete,

}:DesignationTableProps) {

    if(items.length === 0) {

        return (

            <div className="rounded-lg border bg-white p-8 text-center text-gray-500">

                No designations found.

            </div>

        );

    }

    return (

        <div className="overflow-x-auto rounded-lg border bg-white">

            <table className="min-w-full">

                <thead className="bg-gray-50">

                    <tr>

                        <th className="px-4 py-3 text-left text-sm font-semibold">

                            Code

                        </th>

                        <th className="px-4 py-3 text-left text-sm font-semibold">

                            Designation

                        </th>

                        <th className="px-4 py-3 text-left text-sm font-semibold">

                            Department

                        </th>

                        <th className="px-4 py-3 text-left text-sm font-semibold">

                            Status

                        </th>

                        <th className="px-4 py-3 text-right text-sm font-semibold">

                            Actions

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {items.map(

                        designation => (

                            <tr
                                key={designation.id}
                                className="border-t"
                            >

                                <td className="px-4 py-3">

                                    {designation.designationCode}

                                </td>

                                <td className="px-4 py-3">

                                    <div className="font-medium">

                                        {designation.designationName}

                                    </div>

                                    {

                                        designation.description && (

                                            <div className="text-sm text-gray-500">

                                                {designation.description}

                                            </div>

                                        )

                                    }

                                </td>

                                <td className="px-4 py-3">

                                    {

                                        designation.departmentId ??

                                        "-"

                                    }

                                </td>

                                <td className="px-4 py-3">

                                    <span
                                        className={
                                            designation.status === "Active"

                                                ? "rounded bg-green-100 px-2 py-1 text-xs text-green-700"

                                                : "rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"
                                        }
                                    >

                                        {designation.status}

                                    </span>

                                </td>

                                <td className="px-4 py-3">

                                    <div className="flex justify-end gap-2">

                                        <button
                                            className="rounded border px-3 py-1 text-sm"
                                            onClick={() =>
                                                onEdit?.(
                                                    designation,
                                                )
                                            }
                                        >

                                            Edit

                                        </button>

                                        <button
                                            className="rounded border border-red-300 px-3 py-1 text-sm text-red-600"
                                            onClick={() =>
                                                onDelete?.(
                                                    designation,
                                                )
                                            }
                                        >

                                            Delete

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ),

                    )}

                </tbody>

            </table>

        </div>

    );

}