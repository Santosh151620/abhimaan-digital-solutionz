import type { ReactNode } from "react";

import CRMSidebar from "@/components/crm/layout/CRMSidebar";
import CRMHeader from "@/components/crm/layout/CRMHeader";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    return (
        <div
            className="
                min-h-screen
                w-full
                overflow-x-hidden
                bg-[#0f1115]
                text-white
            "
        >
            <div
                className="
                    flex
                    min-h-screen
                    w-full
                    min-w-0
                    overflow-x-hidden
                "
            >
                {/* CRM navigation */}
                <CRMSidebar />

                {/* CRM workspace */}
                <div
                    className="
                        flex
                        min-h-screen
                        min-w-0
                        flex-1
                        flex-col
                        overflow-x-hidden
                        bg-gradient-to-br
                        from-[#15100b]
                        via-[#101217]
                        to-[#0c0f14]
                    "
                >
                    {/* Global CRM header */}
                    <CRMHeader />

                    {/* Main CRM workspace */}
                    <main
                        id="main-content"
                        tabIndex={-1}
                        className="
                            min-w-0
                            flex-1
                            overflow-x-hidden
                            px-3
                            py-4
                            sm:px-4
                            sm:py-5
                            md:px-5
                            md:py-6
                            lg:px-6
                            lg:py-7
                            xl:px-8
                            2xl:px-10
                            focus:outline-none
                        "
                    >
                        <div
                            className="
                                mx-auto
                                w-full
                                min-w-0
                                max-w-[1800px]
                            "
                        >
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}