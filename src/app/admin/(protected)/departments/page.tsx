import {
    getDepartments,
} from "./page-actions";

import DepartmentDialog from "@/components/admin/departments/DepartmentDialog";

import DepartmentTable from "@/components/admin/departments/DepartmentTable";

export default async function DepartmentsPage() {

    const departments =
        await getDepartments();

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Departments
                    </h1>

                    <p className="text-sm text-gray-500">
                        Manage organization departments.
                    </p>

                </div>

                <DepartmentDialog />

            </div>

            <DepartmentTable
                departments={departments}
            />

        </div>

    );

}