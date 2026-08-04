"use client";

import type {
    PlatformModule,
} from "@/types/admin/Module";

interface ModulesTableProps {

    modules: PlatformModule[];

}

export default function ModulesTable({

    modules,

}: ModulesTableProps) {

    return (

        <div className="overflow-x-auto rounded-xl border">

            <table className="min-w-full">

                <thead>

                    <tr className="border-b bg-muted/30">

                        <th className="p-3 text-left">
                            Name
                        </th>

                        <th className="p-3 text-left">
                            Code
                        </th>

                        <th className="p-3 text-left">
                            Category
                        </th>

                        <th className="p-3 text-left">
                            Version
                        </th>

                        <th className="p-3 text-left">
                            Status
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {modules.length === 0 && (

                        <tr>

                            <td
                                colSpan={5}
                                className="p-6 text-center text-muted-foreground"
                            >

                                No modules found.

                            </td>

                        </tr>

                    )}

                    {modules.map(module => (

                        <tr
                            key={module.id}
                            className="border-b"
                        >

                            <td className="p-3 font-medium">
                                {module.name}
                            </td>

                            <td className="p-3">
                                {module.code}
                            </td>

                            <td className="p-3">
                                {module.category}
                            </td>

                            <td className="p-3">
                                {module.version}
                            </td>

                            <td className="p-3">
                                {module.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}