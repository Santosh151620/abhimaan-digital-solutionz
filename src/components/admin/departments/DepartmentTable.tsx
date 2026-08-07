"use client";

import type {
    Department,
} from "@/types/admin/Department";

interface DepartmentTableProps {
    departments: Department[];
    onEdit?:(department:Department)=>void;
    onDelete?:(department:Department)=>void;
}

export default function DepartmentTable({
    departments,
    onEdit,
    onDelete,
}:DepartmentTableProps) {

    if(departments.length===0){

        return(
            <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
                No departments found.
            </div>
        );

    }

    return(

        <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">

            <table className="min-w-full">

                <thead className="bg-gray-100">

                    <tr>

                        <th className="px-4 py-3 text-left text-sm font-semibold">
                            Code
                        </th>

                        <th className="px-4 py-3 text-left text-sm font-semibold">
                            Department
                        </th>

                        <th className="px-4 py-3 text-left text-sm font-semibold">
                            Status
                        </th>

                        <th className="px-4 py-3 text-left text-sm font-semibold">
                            Manager
                        </th>

                        <th className="px-4 py-3 text-left text-sm font-semibold">
                            Parent
                        </th>

                        <th className="px-4 py-3 text-right text-sm font-semibold">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {departments.map(

                        department=>(

                            <tr
                                key={department.id}
                                className="border-t"
                            >

                                <td className="px-4 py-3">
                                    {department.departmentCode}
                                </td>

                                <td className="px-4 py-3 font-medium">
                                    {department.departmentName}
                                </td>

                                <td className="px-4 py-3">

                                    <span
                                        className={
                                            department.status==="Active"
                                                ? "rounded bg-green-100 px-2 py-1 text-xs text-green-700"
                                                : "rounded bg-red-100 px-2 py-1 text-xs text-red-700"
                                        }
                                    >
                                        {department.status}
                                    </span>

                                </td>

                                <td className="px-4 py-3">
                                    {department.managerId ?? "-"}
                                </td>

                                <td className="px-4 py-3">
                                    {department.parentDepartmentId ?? "-"}
                                </td>

                                <td className="px-4 py-3">

                                    <div className="flex justify-end gap-2">

                                        <button
                                            onClick={()=>onEdit?.(department)}
                                            className="rounded border px-3 py-1 text-sm hover:bg-gray-100"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={()=>onDelete?.(department)}
                                            className="rounded border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
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