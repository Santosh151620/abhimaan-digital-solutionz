import Link from "next/link";


const navigation = [

    {
        name: "Dashboard",
        href: "/admin/dashboard",
    },

    {
        name: "Organizations",
        href: "/admin/organizations",
    },

    {
        name: "Users",
        href: "/admin/users",
    },

    {
        name: "Teams",
        href: "/admin/teams",
    },

    {
        name: "Departments",
        href: "/admin/departments",
    },

    {
        name: "Designations",
        href: "/admin/designations",
    },

    {
        name: "Branches",
        href: "/admin/branches",
    },

    {
        name: "Locations",
        href: "/admin/locations",
    },

    {
        name: "Roles",
        href: "/admin/roles",
    },

    {
        name: "Role Permissions",
        href: "/admin/role-permissions",
    },

    {
        name: "Permissions",
        href: "/admin/permissions",
    },

    {
        name: "Policies",
        href: "/admin/policies",
    },

    {
        name: "Modules",
        href: "/admin/modules",
    },

    {
        name: "Workflows",
        href: "/admin/workflows",
    },

    {
        name: "Notifications",
        href: "/admin/notifications",
    },

    {
        name: "Audit Logs",
        href: "/admin/audit-logs",
    },

    {
        name: "Health",
        href: "/admin/health",
    },

];


const accountNavigation = [

    {
        name: "My Profile",
        href: "/admin/profile",
    },

    {
        name: "Security",
        href: "/admin/security",
    },

    {
        name: "Settings",
        href: "/admin/settings",
    },

];


export default function AdminSidebar() {

    return (

        <aside
            className="
                hidden
                w-72
                shrink-0
                border-r
                border-white/10
                bg-[#0b0b0b]
                lg:block
            "
        >

            <div
                className="
                    flex
                    h-16
                    items-center
                    border-b
                    border-white/10
                    px-6
                "
            >

                <Link
                    href="/admin/dashboard"
                    className="
                        text-lg
                        font-bold
                        text-amber-300
                    "
                >
                    ADS Admin
                </Link>

            </div>


            <nav
                className="
                    h-[calc(100vh-4rem)]
                    overflow-y-auto
                    space-y-1
                    p-4
                "
            >

                <p className="
                    mb-3
                    px-3
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-widest
                    text-slate-500
                ">
                    Administration
                </p>


                {navigation.map((item) => (

                    <Link
                        key={item.href}
                        href={item.href}
                        className="
                            block
                            rounded-lg
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-slate-300
                            transition
                            hover:bg-white/5
                            hover:text-amber-300
                        "
                    >
                        {item.name}
                    </Link>

                ))}


                <div
                    className="
                        my-5
                        border-t
                        border-white/10
                    "
                />


                <p className="
                    mb-3
                    px-3
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-widest
                    text-slate-500
                ">
                    Account
                </p>


                {accountNavigation.map((item) => (

                    <Link
                        key={item.href}
                        href={item.href}
                        className="
                            block
                            rounded-lg
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-slate-300
                            transition
                            hover:bg-white/5
                            hover:text-amber-300
                        "
                    >
                        {item.name}
                    </Link>

                ))}


                <button
                    type="button"
                    className="
                        mt-4
                        w-full
                        rounded-lg
                        border
                        border-white/10
                        px-4
                        py-2
                        text-left
                        text-sm
                        font-medium
                        text-slate-300
                        transition
                        hover:border-amber-300/30
                        hover:text-amber-300
                    "
                >
                    Logout
                </button>


            </nav>

        </aside>

    );

}