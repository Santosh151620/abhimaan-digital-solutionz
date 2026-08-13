import type {
    ReactNode,
} from "react";


import {
    requireAdmin,
} from "@/lib/requireAdmin";


import AdminLayout from "@/components/admin/AdminLayout";



interface AdminProtectedLayoutProps {

    children:ReactNode;

}



export default async function AdminProtectedLayout({

    children,

}:AdminProtectedLayoutProps) {


    await requireAdmin(
        "ORGANIZATION_ADMIN",
    );



    return (

        <AdminLayout>

            {children}

        </AdminLayout>

    );

}