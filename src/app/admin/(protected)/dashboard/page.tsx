import Link from "next/link";

import DashboardCards from "@/components/admin/dashboard/DashboardCards";
import SystemHealthCard from "@/components/admin/dashboard/SystemHealthCard";

import type { AdminDashboard } from "@/types/admin/Admin";

import { AdminService } from "@/services/admin/AdminService";
import { SupabaseAdminRepository } from "@/repositories/admin/SupabaseAdminRepository";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";


export const dynamic = "force-dynamic";


async function getAdminDashboard(): Promise<AdminDashboard | null> {

    try {

        const supabase =
            await createSupabaseServerClient();

        const repository =
            new SupabaseAdminRepository(
                supabase,
            );

        const service =
            new AdminService(
                repository,
            );

        return await service.dashboard();

    } catch {

        return null;

    }

}


export default async function DashboardPage() {

    const dashboard =
        await getAdminDashboard();


    const summary =
        dashboard?.summary;


    const dashboardCards = [

        {
            title: "Organizations",
            value:
                summary?.organizations ?? 0,
            description:
                "Registered organizations",
        },

        {
            title: "Users",
            value:
                summary?.users ?? 0,
            description:
                "Organization users",
        },

        {
            title: "Active Users",
            value:
                summary?.activeUsers ?? 0,
            description:
                "Currently active users",
        },

        {
            title: "Enabled Modules",
            value:
                summary?.enabledModules ?? 0,
            description:
                "Currently enabled platform modules",
        },

    ];


    return (

        <main className="space-y-8 p-8">

            <section>

                <h1 className="text-3xl font-bold">
                    Admin Dashboard
                </h1>

                <p className="text-muted-foreground">
                    Platform overview and business administration summary.
                </p>

            </section>


            <DashboardCards
                cards={dashboardCards}
            />


            <SystemHealthCard
              status={
    dashboard
        ? "Healthy"
        : "Warning"
}
                lastChecked={
                    dashboard?.generatedAt
                        ? new Date(
                            dashboard.generatedAt,
                        ).toLocaleString()
                        : new Date().toLocaleString()
                }
            />


            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">


                <div
                    className="
                        rounded-xl
                        border
                        bg-background
                        p-6
                    "
                >

                    <h2 className="mb-5 text-xl font-semibold">
                        Administration
                    </h2>


                    <div className="space-y-3">


                        <Link
                            href="/admin/users"
                            className="
                                block
                                rounded-lg
                                border
                                p-3
                                hover:bg-muted
                            "
                        >
                            Users
                        </Link>


                        <Link
                            href="/admin/roles"
                            className="
                                block
                                rounded-lg
                                border
                                p-3
                                hover:bg-muted
                            "
                        >
                            Roles
                        </Link>


                        <Link
                            href="/admin/permissions"
                            className="
                                block
                                rounded-lg
                                border
                                p-3
                                hover:bg-muted
                            "
                        >
                            Permissions
                        </Link>


                        <Link
                            href="/admin/organizations"
                            className="
                                block
                                rounded-lg
                                border
                                p-3
                                hover:bg-muted
                            "
                        >
                            Organizations
                        </Link>

                    </div>

                </div>


                <div
                    className="
                        rounded-xl
                        border
                        bg-background
                        p-6
                    "
                >

                    <h2 className="mb-5 text-xl font-semibold">
                        Platform
                    </h2>


                    <div className="space-y-3">


                        <Link
                            href="/admin/modules"
                            className="
                                block
                                rounded-lg
                                border
                                p-3
                                hover:bg-muted
                            "
                        >
                            Modules
                        </Link>


                        <Link
                            href="/admin/settings"
                            className="
                                block
                                rounded-lg
                                border
                                p-3
                                hover:bg-muted
                            "
                        >
                            Settings
                        </Link>


                        <Link
                            href="/admin/workflows"
                            className="
                                block
                                rounded-lg
                                border
                                p-3
                                hover:bg-muted
                            "
                        >
                            Workflows
                        </Link>


                        <Link
                            href="/admin/audit-logs"
                            className="
                                block
                                rounded-lg
                                border
                                p-3
                                hover:bg-muted
                            "
                        >
                            Audit Logs
                        </Link>

                    </div>

                </div>


                <div
                    className="
                        rounded-xl
                        border
                        bg-background
                        p-6
                    "
                >

                    <h2 className="mb-5 text-xl font-semibold">
                        Dashboard Summary
                    </h2>


                    <dl className="space-y-4">


                        <div className="flex items-center justify-between">

                            <dt className="text-muted-foreground">
                                Roles
                            </dt>

                            <dd className="font-semibold">
                                {summary?.roles ?? 0}
                            </dd>

                        </div>


                        <div className="flex items-center justify-between">

                            <dt className="text-muted-foreground">
                                Permissions
                            </dt>

                            <dd className="font-semibold">
                                {summary?.permissions ?? 0}
                            </dd>

                        </div>


                        <div className="flex items-center justify-between">

                            <dt className="text-muted-foreground">
                                Total Modules
                            </dt>

                            <dd className="font-semibold">
                                {summary?.modules ?? 0}
                            </dd>

                        </div>


                        <div className="flex items-center justify-between">

                            <dt className="text-muted-foreground">
                                Audit Records
                            </dt>

                            <dd className="font-semibold">
                                {summary?.audits ?? 0}
                            </dd>

                        </div>

                    </dl>

                </div>


            </section>


        </main>

    );

}
