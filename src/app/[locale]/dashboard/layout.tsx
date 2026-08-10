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
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-950 text-white">
      <div className="flex min-h-screen w-full min-w-0">
        {/* CRM navigation */}
        <CRMSidebar />

        {/* CRM workspace */}
        <div className="flex min-w-0 flex-1 flex-col">
          <CRMHeader />

          <main
            id="main-content"
            className="
              min-w-0
              flex-1
              overflow-x-hidden
              px-3 py-4
              sm:px-4 sm:py-5
              md:px-5 md:py-6
              lg:px-6 lg:py-7
              xl:px-8
              2xl:px-10
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