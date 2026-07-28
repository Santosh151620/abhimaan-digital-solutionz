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
        name: "Roles",
        href: "/admin/roles",
    },

    {
        name: "Permissions",
        href: "/admin/permissions",
    },

    {
        name: "Modules",
        href: "/admin/modules",
    },

    {
        name: "Audit",
        href: "/admin/audit",
    },

    {
        name: "Health",
        href: "/admin/health",
    },

    {
        name: "Settings",
        href: "/admin/settings",
    },

];


export default function AdminSidebar() {

    return (

        <aside className="hidden w-64 shrink-0 border-r bg-background lg:block">


            <div className="flex h-16 items-center border-b px-6">

                <Link
                    href="/admin/dashboard"
                    className="text-lg font-bold"
                >
                    ADS Admin
                </Link>

            </div>


            <nav className="space-y-1 p-4">


                {
                    navigation.map((item) => (

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
                                text-muted-foreground
                                hover:bg-muted
                                hover:text-foreground
                            "

                        >

                            {item.name}

                        </Link>

                    ))
                }


            </nav>


        </aside>

    );

}