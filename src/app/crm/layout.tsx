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

<div className="min-h-screen bg-[radial-gradient(circle_at_top_right,#1d4ed8_0%,#0f172a_35%,#020617_100%)]">
            <CRMSidebar />

            <div className="flex min-w-0 flex-1 flex-col">

                <CRMHeader />

                <main className="flex-1 overflow-y-auto">

                    <div className="mx-auto max-w-[1700px] p-8">

                        {children}

                    </div>

                </main>

            </div>

            <HelpCenter />

        </div>

    );

}