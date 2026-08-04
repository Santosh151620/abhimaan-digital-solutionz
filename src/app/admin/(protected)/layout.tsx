import {
    requireAdmin,
} from "@/lib/requireAdmin";


export default async function AdminLayout({

    children,

}: {

    children: React.ReactNode;

}) {


    await requireAdmin(

        "ORGANIZATION_ADMIN"

    );


    return (

        <>

            {children}

        </>

    );

}