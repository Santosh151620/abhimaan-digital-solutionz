import {
    requireAdmin,
} from "@/lib/requireAdmin";

import AdminLayout from "@/components/admin/AdminLayout";


export default async function AdminProtectedLayout({

    children,

}: {

    children: React.ReactNode;

}) {


    await requireAdmin(
        "ORGANIZATION_ADMIN",
    );


    return (

        <AdminLayout>

            {children}

        </AdminLayout>

    );

}