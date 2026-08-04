import RoleTable from "@/components/admin/rbac/RoleTable";


export default function RBACPage() {


    return (

        <main className="p-8">


            <h1 className="mb-6 text-2xl font-bold">

                Enterprise RBAC Management

            </h1>


            <RoleTable />


        </main>

    );

}
