import type {
    ReactNode,
} from "react";


import AdminHeader from "./AdminHeader";

import AdminSidebar from "./AdminSidebar";



interface AdminLayoutProps {

    children:ReactNode;

}



export default function AdminLayout({

    children,

}:AdminLayoutProps) {


    return (

        <div

            className="
                flex
                min-h-screen
                bg-background
                text-foreground
            "

        >


            <AdminSidebar />



        <div className="
    flex
    min-w-0
    flex-1
    flex-col
    overflow-hidden
">


                <AdminHeader />



                <main

                    className="
                        flex-1
                        overflow-y-auto
                        px-5
                        py-6
                        lg:px-8
                        lg:py-8
                    "

                >


                    <div

                        className="
                            mx-auto
                            w-full
                            max-w-[1600px]
                        "

                    >

                        {children}

                    </div>


                </main>


            </div>


        </div>

    );

}