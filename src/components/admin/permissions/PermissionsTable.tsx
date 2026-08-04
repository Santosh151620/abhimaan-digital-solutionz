"use client";

import type {
    Permission,
} from "@/types/admin/Permission";

interface PermissionsTableProps {

    permissions: Permission[];

    onEdit?: (
        permission: Permission,
    ) => void;

    onDelete?: (
        id: string,
    ) => Promise<void>;

}

export default function PermissionsTable({

    permissions,

    onEdit,

    onDelete,

}: PermissionsTableProps) {

    return (

        <div className="overflow-x-auto rounded-xl border">

            <table className="min-w-full">

                <thead>

                    <tr className="border-b bg-muted/30">

                        <th className="p-3 text-left">
                            Key
                        </th>

                        <th className="p-3 text-left">
                            Module
                        </th>

                        <th className="p-3 text-left">
                            Action
                        </th>

                        <th className="p-3 text-left">
                            Type
                        </th>

                        <th className="p-3 text-right">
                            Actions
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {permissions.length === 0 && (

                        <tr>

                            <td
                                colSpan={5}
                                className="p-6 text-center text-muted-foreground"
                            >

                                No permissions found.

                            </td>

                        </tr>

                    )}

                    {permissions.map((permission) => (

                        <tr
                            key={permission.id}
                            className="border-b"
                        >

                            <td className="p-3 font-medium">
                                {permission.key}
                            </td>

                            <td className="p-3">
                                {permission.module}
                            </td>

                            <td className="p-3">
                                {permission.action}
                            </td>

                            <td className="p-3">
                                {permission.type}
                            </td>

                            <td className="p-3 text-right">

                                <div className="flex justify-end gap-2">

                                    {onEdit && (

                                        <button
                                            type="button"
                                            onClick={() => onEdit(permission)}
                                            className="rounded border px-3 py-1"
                                        >

                                            Edit

                                        </button>

                                    )}

                                    {onDelete && (

                                        <button
                                            type="button"
                                            onClick={() => void onDelete(permission.id)}
                                            className="rounded border px-3 py-1 text-destructive"
                                        >

                                            Delete

                                        </button>

                                    )}

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}