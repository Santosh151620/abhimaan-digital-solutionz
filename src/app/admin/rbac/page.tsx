import RoleTable from
    "@/components/admin/rbac/RoleTable";



export default function RBACPage() {

    return (

        <main className="p-8">

            <div className="mb-6">

                <h1 className="text-2xl font-bold">

                    Enterprise RBAC Management

                </h1>


                <p className="mt-1 text-sm text-gray-500">

                    Manage roles and access permissions
                    across the ADS platform.

                </p>

            </div>


            <RoleTable />

        </main>

    );

}
