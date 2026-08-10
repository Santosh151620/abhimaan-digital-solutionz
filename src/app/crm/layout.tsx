import type { ReactNode } from "react";

import CRMHeader from "@/components/crm/layout/CRMHeader";
import CRMSidebar from "@/components/crm/layout/CRMSidebar";
import HelpCenter from "@/components/crm/layout/HelpCenter";


export default function CRMLayout({
    children,
}: {
    children: ReactNode;
}) {

    return (

        <div
            className="
                flex
                min-h-screen
                overflow-hidden
                bg-[#09090B]
                bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(203,213,225,0.10),transparent_32%),linear-gradient(135deg,#09090B_0%,#111111_45%,#1A140B_100%)]
            "
        >

            <CRMSidebar />


            <div
                className="
                    flex
                    min-w-0
                    flex-1
                    flex-col
                "
            >

                <CRMHeader />


                <main
                    className="
                        flex-1
                        overflow-y-auto
                        scrollbar-thin
                        scrollbar-track-transparent
                        scrollbar-thumb-white/10
                    "
                >

                    <div
                        className="
                            mx-auto
                            min-h-full
                            w-full
                            max-w-[1800px]
                            px-4
                            py-6
                            sm:px-6
                            lg:px-8
                            xl:px-10
                        "
                    >

                        <div
                            className="
                                rounded-[32px]
                                border
                                border-white/[0.08]
                                bg-white/[0.025]
                                p-4
                                shadow-2xl
                                shadow-black/20
                                backdrop-blur-xl
                                sm:p-6
                                lg:p-8
                            "
                        >

                            {children}

                        </div>

                    </div>

                </main>

            </div>


            <HelpCenter />

        </div>

    );

}